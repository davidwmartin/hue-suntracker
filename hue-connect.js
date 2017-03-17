///// Imports and such
var hue = require('node-hue-api'), 
		HueApi = hue.HueApi,
		lightState = hue.lightState,
		hueLogin = require('./config/hue-login.js');


// setup bridge connection vars
// NOTE -- still requires manually setting the username (stored in config/hue-login.js so I don't have to publish my config to github)
var username = hueLogin.username,
		hostname;


////////////// FIRE MISSILES
// NOTE -- meant to be called from command line (i.e. w/cron), assumes first argument will be the ID of the desired scene
var requestedSceneId = process.argv[2];
boomBoom(requestedSceneId);




////// Main function to run all the below
// ((EXPORT THIS!!!)) not right now...
function boomBoom(sceneId){
	// search for bridges
	hue.nupnpSearch()
		.then(getBridgeHost)
		// .then(bridgeConnect)
		.then(changeScene(sceneId))
		.done();
};

///// search network for bridges
// hue.nupnpSearch().then(getBridgeHost).done();

// gets IP address of first bridge connected to network
function getBridgeHost(bridge){
	hostname = bridge[0].ipaddress;
	console.log("bridge host: " + hostname);

};

// // Connects to bridge w/completed creds
// function bridgeConnect(){
// 	console.log('connect success');

// 	// api.getFullState().then(displayResult).done();
// };

// Changes light scene based on passed in scene ID
function changeScene(sceneId){
	var api = new HueApi(hostname, username);
	api.activateScene(sceneId)
		.then(console.log('changed scene to ' + sceneId))
		.then(console.log('api: ' + api.hostname));
};

// Utility function to display result of bridge calls
displayResult = function(result) {
    console.log(JSON.stringify(result, null, 2));
};
