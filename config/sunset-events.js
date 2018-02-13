// timing variables and array of timeXlight events
lightEvents = [
	{
		name:"pre sunset",
		offset: -50, // offset (in minutes) compared to sunset time
		scene:"SCENE_ID" // id string for your desired scene
	},
	{
		name:"sunset start",
		offset:-5, // offset (in minutes) compared to sunset time
		scene:"SCENE_ID" // id string for your desired scene
	},
	{
		name:"sunset end",
		offset:5, // offset (in minutes) compared to sunset time
		scene:"SCENE_ID" // id string for your desired scene
	},
	{
		name:"post sunset",
		offset: 15, // offset (in minutes) compared to sunset time
		scene:"SCENE_ID" // id string for your desired scene
	}
];

module.exports = lightEvents;