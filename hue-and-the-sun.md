# Hue and the Sun

## Misc

### Sun Times
http://api.sunrise-sunset.org/json?lat=LATTITUDE&lng=-LONGITUDE&date=today

### Node & APIs
http://stackoverflow.com/questions/5643321/how-to-make-remote-rest-call-inside-node-js-any-curl

https://rapiddg.com/blog/calling-rest-api-nodejs-script

#### Scheduling
https://www.npmjs.com/package/crontab

## Code Overview

Two Main Parts:

1. suntracker.js -- gets sunset time, calculates light event times, schedules cron jobs
2. hue-connect.js -- used to connect to hue bridge and execute light changes at scheduled time (will likely be extended / replaced by more robust set of node-based hue tools).

See comments in those files to get a sense for how it works.

NOT INCLUDED IN REPO:
config folder containing the following:

hue-login.js

	hueLogin - {
		username = "YOUR HUE BRIDGE USERNAME GOES HERE"
	}

sunset-events.js (add as many sunset events as you want)

	lightEvents = [
		{
			offset: -45, // number of minutes offset from time of sunset (negative for before)
			scene: "jkashdfjkadssadf" // ID of Hue scene that you want to activate at the time dictated by the given offset
		}
	]
