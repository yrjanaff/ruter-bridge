const ruter = require('ruter-api');
const bodyParser = require('body-parser');
const utm = require('utm')
const dateformat = require('dateformatter').format;
const ApiAiApp = require('actions-on-google').ApiAiApp;
const debug = require('debug')('app');
//const location = utm.fromLatLon(59.9382647,10.8129383, 32);
debug.log = console.log.bind(console);
exports.findBus = (req, res) => {
    const apiai = new ApiAiApp({request: req, response: res});

    function search() {
        if (apiai.isPermissionGranted()) {

            const coordinates = apiai.getDeviceLocation().coordinates;
            const location = utm.fromLatLon(coordinates.latitude, coordinates.longitude, 32);
            ruter.api("Place/GetClosestStops?coordinates=(x="+Math.round(location.easting)+",y="+Math.round(location.northing)+")", {}, response => {
                var transportation = apiai.getContextArgument('requesting-bus', 'Transportation-method');
                var transportationId = transportation == 'bus' ? 2 : 8;
                debug("Transportation: " + transportationId);
                console.log("Transportation: " + transportationId);

                const result = response.result.filter(stop => stop.Lines.filter(line => line.Transportation == transportationId).length > 0);
                console.log("Results: " + JSON.stringify(result));

                ruter.api("StopVisit/GetDepartures/"+result[0].ID, {}, response => {
                    const expectedDepartureTime = response.result[0].MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime;
                    console.log("ExpectedDepartureTime: " + expectedDepartureTime);

                    const date = new Date(expectedDepartureTime);
                    const name = response.result[0].MonitoredVehicleJourney.MonitoredCall.DestinationDisplay;
                    const text = "The " + transportation + " " + name + " is leaving at " + dateformat("H:i", date)+ ". It's in " + parseInt(dateformat("i", date - new Date())) + " minutes";
                    apiai.tell(text);
                });
            });
        }else{
            apiai.tell('Sorry, I need to know your current address');
        }
    }
    function check() {
        const permissions = [
            apiai.SupportedPermissions.DEVICE_PRECISE_LOCATION
        ];
        apiai.askForPermissions('To find your nearest bus stop', permissions);
    }


        const actionMap = new Map();
        actionMap.set('permission.granted', search);
        actionMap.set('bus.schedule', check);
        apiai.handleRequest(actionMap);
};
