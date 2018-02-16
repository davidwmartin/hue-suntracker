# Hue Suntracker

Sync your Philips Hue lights with the sun, using node + cron.

See hue-and-the-sun.mdown for dev notes / explanation. 

Intended for use on a raspberry pi, but anything linux should be fine (uses cron).


## TODO 

* cron task to run this script every day (secondary "initialize.js" or something that you run once to set up a cron task to run suntracker.js every day)
* Extract common Hue components for use in other apps (or turn this into more of a master-hue-project repository)
	- search for scenes by name?
* Way to view currently scheduled events, and cancel them if need be (web form?)
	- cancel today, cancel all week, etc?


## Changelog

(pre-release)