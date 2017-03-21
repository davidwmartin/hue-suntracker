# Hue Suntracker

Sync your Philips Hue lights with the sun, using node + cron.

See hue-and-the-sun.mdown for dev notes / explanation. 

Intended for use on a raspberry pi, but anything linux should be fine (uses cron).


## TODO 

* way of deleting old cron tasks so they dont muck up crontab file (by comments?)
* cron task to run this script every day (secondary "initialize.js" or something that you run once to set up a cron task to run suntracker.js every day)
* logging (create log file every time the init script runs, every time a light change event happens -- record the command and time or something)
* Generalize so it's not hardcoded for my geographic location
* Extract common Hue components for use in other apps (or turn this into more of a master-hue-project repository)
	- search for scenes by name?


## Changelog

(pre-release)