// require modules
var querystring = require('querystring'),
		http = require('http'),
		crontab = require('crontab'), 
		moment = require('moment'), 
		hueConnect = require('./hue-connect');

// array of timing events
var firstEventTime, secondEventTime, thirdEventTime,
	lightEvents = [
		{
			time:firstEventTime,
			scene:"eL1TQfrb8mmUfjS" // "bright"
		},
		{
			time:secondEventTime,
			scene:"44vKzz9DvQNo46l" // "decoGreco..."
		},
		{
			time:thirdEventTime,
			scene:"Dn0iPwOfg076cME" // "dim"
		}
	];

////// Main Action Here:

// fire primary function to do everything
// getSunrise();

// Fires hue connect script (imported above)
// hueConnect.connect("w0H0sWrsfetnqWF");



////// Make call to sunrise-sunset API to get sun timing info for today
function getSunrise() { 
	
	var sunDataSet;

	// request vars
	var options = {
		// params for lattitude + longitude, date, formatting
		host: 'http://api.sunrise-sunset.org/json?lat=34.168851&lng=-118.605448&date=today&formatted=0'
	}

	// executes http request to get sunset time
	http.get(options.host, function(res){
		var data = "";

		// console.log('STATUS: ' + res.statusCode);
	 //  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	  	var sunData = JSON.parse(chunk);
	  	sunDataSet = sunData.results.sunset;

	  	// call function to calculate light events based on sunset
	  	calcLightEvents(sunDataSet);

	  });

	});

}


////// Calculate timing of necessary light changes
function calcLightEvents(sunDataSet){

	console.log("calc function: " + sunDataSet);

	// get moment.js moment for sunset
	var sdrMoment = moment(sunDataSet);
	// get time for 45 mins before sunset
	var preSunset = sdrMoment.subtract(45,'m').format("m H D M");
	// console.log("preSunset: " + preSunset);

	// schedule cron events based on times calculated here
	cronSched(preSunset+" *");

}


////// CRON

// Gets path of hue script (for cron command)
function getLightScriptPath(){
	var lightScriptPath = require.resolve('./hue-connect');

	return lightScriptPath;
}


// formats cron command
function formatCron(){

	for (i = 0; i < 3; i++){
		command = lightEvents[i].scene;
		jobTime = lightEvents[i].time;

		cronSched(command, jobTime);
	}

}

formatCron();


// Schedules actual jobs w/passed in command and jobTime
function cronSched(command, jobTime){

	crontab.load(function(err, crontab) {
		if (err){
			return console.log(err);
		}

		var job = crontab.create(command, jobTime);

		// var jobs = crontab.jobs();
		// console.log(jobs);

		// save
	  crontab.save(function(err, crontab) {});

		console.log("cron job scheduling complete");

	});

}
