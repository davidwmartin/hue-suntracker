// require modules
var querystring = require('querystring'),
		http = require('http'),
		crontab = require('crontab'), 
		moment = require('moment');

// light event variables (may not need these here)
var lightEvents = [];


////// Main Action Here:

// fire first function to do everything
getSunset();



////// Make call to sunrise-sunset API to get sun timing info for today
function getSunset() { 
	
	var sunDataSet;

	// request vars
	var options = {
		// params for lattitude + longitude, date, formatting
		host: 'http://api.sunrise-sunset.org/json?lat=34.168851&lng=-118.605448&date=today&formatted=0'
	}

	// executes http request to get sunset time
	http.get(options.host, function(res){
		var data = "";
	  
	  res.setEncoding('utf8');
	  res.on('data', function (chunk) {
	  	var sunData = JSON.parse(chunk);
	  	sunDataSet = sunData.results.sunset;

	  	// call function to calculate light events based on sunset
	  	lightEvents = calcLightEvents(sunDataSet);

	  });

	});

}


////// Calculate timing of necessary light changes
function calcLightEvents(sunDataSet){

	console.log("sunset: " + sunDataSet);

	// get moment.js moment for sunset
	var sdrMoment = moment(sunDataSet);
	// get moments for various offsets from sunset
	var prePreSunset = sdrMoment.subtract(120,'m').format("m H D M");
	var preSunset = sdrMoment.subtract(45,'m').format("m H D M");
	var postSunset1 = sdrMoment.add(75,'m').format("m H D M");
	var postSunset2 = sdrMoment.add(255,'m').format("m H D M");

	// TODO - seems a bit verbose setting up the event array this way (also some dirrrttyy ish happening with the string concatenation) (also not super easy to add events if doing it this way)
	// TODO - unnecessary
	firstEventTime = preSunset + " *";
	secondEventTime = postSunset1 + " *";
	thirdEventTime = postSunset2 + " *";
	fourthEventTime = prePreSunset + " *";

	// timing variables and array of timeXlight events
	lightEvents = [
		{
			time:fourthEventTime,
			scene:"SzTWcta-JSvvPj1" // "creekbed afternoon"
		},
		{
			time:firstEventTime,
			scene:"eL1TQfrb8mmUfjS" // "bright"
		},
		{
			time:secondEventTime,
			scene:"PVB-BYTBE2OzN7j" // "pencils"
		},
		{
			time:thirdEventTime,
			scene:"t6BAS0g6mBJiznk" // "tropical twilight"
		}
	];

	console.log('calculated events: '+ lightEvents.length);

	// return lightEvents;
	cronSched(lightEvents);
}


////// CRON

// Gets path of hue script (for cron command)
// TODO -- move / refactor?
function getHueScriptPath(){
	var lightScriptPath = require.resolve('./hue-connect');
	return lightScriptPath;
}

// formats cron command
function formatCron(sceneId){
	var hueScriptPath = getHueScriptPath();
	// TODO -- better way of formatting command? bit rough, but I suppose it works
	formattedCommand = "node " + hueScriptPath + " " + sceneId;
	console.log("formatted command: " + formattedCommand);

	return formattedCommand;
}

// schedules cron jobs
function cronSched(lightEvents){

	crontab.load(function(err, crontab) {
		if (err){
			return console.log(err);
		}

		var jobScene, jobCommand, jobTime;

		for (i = 0; i < lightEvents.length; i++){

			jobScene = lightEvents[i].scene;
			jobCommand = formatCron(jobScene);
			jobTime = lightEvents[i].time;

			// var currentJob = crontab.create(jobCommand,jobTime);
			var currentJob = crontab.create(jobCommand, jobTime);

			console.log('job created. index: ' + i);

		}

		var jobsss = crontab.jobs();
		console.log(jobsss);
		// save
	  crontab.save(function(err, crontab) {});

		console.log("cronSched complete");
		console.log("crontab: " + JSON.stringify(crontab));

	});

}