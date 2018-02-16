///// Imports and such
var hue = require('node-hue-api'), 
		HueApi = hue.HueApi,
		lightState = hue.lightState,
		config = require('./config/config.js');


// setup bridge connection vars
// NOTE -- still requires manually setting the username (stored in config/hue-login.js so I don't have to publish my config to github)
var username = config.username,
		hostname,
		api;


////////////// FIRE MISSILES
// NOTE -- meant to be called from command line (e.g. w/cron), assumes first argument will be the ID of the desired scene
var requestedSceneId = process.argv[2];
hueActivate(requestedSceneId);


////// Guts of it

// Main function -- connects to bridge and activates scene (takes sceneId arg)
function hueActivate(sceneId){
	// search for bridges
	hue.nupnpSearch()
		.then(function(data){

			api = bridgeConnect(data);
			changeScene(sceneId, api);

		})
		.done();
}

// gets IP address of first bridge connected to network, returns api object
function bridgeConnect(bridge){
	hostname = bridge[0].ipaddress;
	console.log("bridge host: " + hostname);
	api = new HueApi(hostname, username);
	console.log("api: " + api);
	return api;
}

// Changes light scene based on passed in scene ID
function changeScene(sceneId, api){
	api.activateScene(sceneId)
		.then(console.log('changed scene to ' + sceneId));
}

// Utility function to display result of bridge calls
displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
}
