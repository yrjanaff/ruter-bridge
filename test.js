const ruter = require('ruter-api');
const utm = require('utm')
var dateformat = require('dateformatter').format;

const location = utm.fromLatLon(59.9382647,10.8129383, 32);
console.log(location)
ruter.api("Place/GetClosestStops?coordinates=(x="+Math.round(location.easting)+",y="+Math.round(location.northing)+")", {}, response => {
    console.log("test")
    var transportationId =8;
    console.log("Transportation: " + transportationId);

    const result = response.result.filter(stop => stop.Lines.filter(line => line.Transportation == transportationId).length > 0);
    console.log("Results: " + JSON.stringify(result));

    ruter.api("StopVisit/GetDepartures/"+result[0].ID, {}, response => {
        console.log("hello")
        const expectedDepartureTime = response.result[0].MonitoredVehicleJourney.MonitoredCall.ExpectedDepartureTime;
        console.log("ExpectedDepartureTime: " + expectedDepartureTime);

        const date = new Date(expectedDepartureTime);
        const name = response.result[0].MonitoredVehicleJourney.MonitoredCall.DestinationDisplay;
        const text = "The bus " + name + " is leaving at " + dateformat("H:i", date)+ ". It's in " + parseInt(dateformat("i", date - new Date())) + " minutes";
        console.log(text);
    });
});
