// require modules
var querystring = require('querystring'),
		http = require('http'),
		crontab = require('crontab'), 
		moment = require('moment'),
		lightEvents = require('./config/sunset-events'); // gets lightEvents array from external config file


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

	console.log("events:");
	for (i = 0; i < lightEvents.length; i++){
		// get moment.js moment for sunset
		var ssMoment = moment(sunDataSet);

		// get each event's timing info by adding its offset to the sunset moment
		lightEvents[i].moment = ssMoment.add(lightEvents[i].offset, "m");
		console.log(JSON.stringify(lightEvents[i]));

	}

	cronSched(lightEvents);
}


////// CRON
// Gets path of hue script (for cron command)
function getHueScriptPath(){
	var lightScriptPath = require.resolve('./hue-connect');
	return lightScriptPath;
}

// Formats cron time
function formatCronTime(jobMoment){
	var formattedTime = jobMoment.format("m H D M") + " *";
	console.log("formatted time: " + formattedTime);
	return formattedTime;
}

// formats cron command
function formatCronCommand(sceneId){
	var hueScriptPath = getHueScriptPath();
	// TODO -- better way of formatting command? bit rough, but I suppose it works
	formattedCommand = "node " + hueScriptPath + " " + sceneId;
	console.log("formatted command: " + formattedCommand);
	return formattedCommand;
}

// schedules cron jobs (takes array of light events which have moment properies added)
function cronSched(lightEvents){

	crontab.load(function(err, crontab) {
		if (err){
			return console.log(err);
		}

		var jobScene, jobCommand, jobTime;

		for (i = 0; i < lightEvents.length; i++){

			jobScene = lightEvents[i].scene;
			jobMoment = lightEvents[i].moment;
			jobTime = formatCronTime(jobMoment);
			jobCommand = formatCronCommand(jobScene);

			// var currentJob = crontab.create(jobCommand,jobTime);
			var currentJob = crontab.create(jobCommand, jobTime);

			console.log('job created. index: ' + i);

		}

		// save
	  crontab.save(function(err, crontab) {});

		console.log("cronSched complete");

	});

}