// require modules
var querystring = require('querystring'),
		http = require('http'),
		crontab = require('crontab'), 
		moment = require('moment'),
		fs = require('fs'),
		lightEvents = require('./config/sunset-events'), 
		config = require('./config/config.js'); // gets lightEvents array from external config file



////// Main Action Here:

simpleLog('\n------------------------------');
simpleLog('\n' + moment().format('LLLL') + '\n');

doEverything();


function doEverything(){

	cronClean(); // remove old cron jobs created by this script

	var sunset = getSunset(); // get sunset time

	sunset.then(function(result){
		simpleLog("sunset: " + result);
		var lightEvents = calcLightEvents(result);

		cronSched(lightEvents); // set cron jobs
	});

}


////// Make call to sunrise-sunset API to get sun timing info for today
function getSunset() { 
	
	var sunDataSet;

	// request vars
	var options = {
		// params for lattitude + longitude, date, formatting
		host: 'http://api.sunrise-sunset.org/json?lat='+config.lattitude+'&lng='+config.longitude+'&date=today&formatted=0'
	}


	return new Promise(function(resolve, reject) {

		// executes http request to get sunset time
		http.get(options.host, function(res){
			var data = "";
		  
		  res.setEncoding('utf8');
		  res.on('data', function (chunk) {
		  	var sunData = JSON.parse(chunk);
		  	sunDataSet = sunData.results.sunset;
		  	resolve(sunDataSet);
		  });
		});


	});

}


////// Calculate timing of necessary light changes
function calcLightEvents(sunsetTime){

	simpleLog("\nevents:");

	for (i = 0; i < lightEvents.length; i++){
		// get moment.js moment for sunset
		var ssMoment = moment(sunsetTime);

		// get each event's timing info by adding its offset to the sunset moment
		lightEvents[i].moment = ssMoment.add(lightEvents[i].offset, "m");
		simpleLog(JSON.stringify(lightEvents[i]));
	}

	return lightEvents;
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
	simpleLog("formatted time: " + formattedTime);
	return formattedTime;
}

// formats cron command
function formatCronCommand(sceneId){
	var hueScriptPath = getHueScriptPath();
	// TODO -- better way of formatting command? bit rough, but I suppose it works
	formattedCommand = "node " + hueScriptPath + " " + sceneId;
	simpleLog("formatted command: " + formattedCommand);
	return formattedCommand;
}

// schedules cron jobs (takes array of light events which have moment properies added)
function cronSched(lightEvents){

	crontab.load(function(err, crontab) {
		if (err){
			simpleLog(err);
			return;
		}

		var jobScene, jobCommand, jobTime;

		for (i = 0; i < lightEvents.length; i++){

			jobScene = lightEvents[i].scene;
			jobMoment = lightEvents[i].moment;
			jobTime = formatCronTime(jobMoment);
			jobCommand = formatCronCommand(jobScene);

			var currentJob = crontab.create(jobCommand, jobTime, 'hueSuntracker');
		}
		
		// save
	  crontab.save(function(err, crontab) {});

	});

}

// cron cleanup -- remove any existing hue-suntracker jobs to keep crontab clean

function cronClean(){
	crontab.load(function(err, crontab){
		if (err){
			simpleLog(err);
			return;
		}
		
		crontab.remove({comment:/hueSuntracker/});
		crontab.save(function(err, crontab) {
			if (err){
				simpleLog(err);
				return;
			}
		});
	});
}


// logging shorthand

function simpleLog(logString) {
	fs.appendFile('./log/basicLog.txt', '\n' + logString, (err) => {  
	    if (err) simpleLog(err);
	});
}


