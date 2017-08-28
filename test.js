const ruter = require('ruter-api');
const utm = require('utm')
var dateformat = require('dateformatter').format;

const location = utm.fromLatLon(59.9382647,10.8129383, 32);
console.log(location)
ruter.api("Place/GetClosestStops?coordinates=(x="+Math.round(location.easting)+",y="+Math.round(location.northing)+")", {}, response => {
    result = response;
    ruter.api("StopVisit/GetDepartures/"+response.result[0].ID, {}, response => {
        const expectedDepartureTime = response.result[0].MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime;
        const date = new Date(expectedDepartureTime);
        const name = response.result[0].MonitoredVehicleJourney.MonitoredCall.DestinationDisplay;

        console.log("The bus " + name + " is leaving at " + dateformat("H:i:s", date)+ ". It's in " + parseInt(dateformat("i", date - new Date())) + " minutes");
    });
});
