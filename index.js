#!/usr/bin/env node

'use strict';

require('shelljs/global');
var moment = require('moment');
var _ = require('lodash');
var app = require('./package');

var interval;

// clear screen


if (process.argv.length === 4 && _.isNumber(Number(process.argv[2]))) {
	exec('clear');
    var finishingAt = moment().add(Number(process.argv[2]), process.argv[3]);
    startTimer(finishingAt);
} else if (process.argv.length === 3 && process.argv[2] === '--help') {
	printHelp();
} else {
	exec('clear');
    var finishingAt = moment().add(45, 'minutes');
    startTimer(finishingAt);
}

function printHelp () {
	console.log([app.name, app.version].join(' '));
    console.log('usage: breaktime [units timeunit]');
    console.log('example: breaktime 45 minutes \n');
    console.log('NOTE: In absence of defined time,');
    console.log('      breaktime will default to 45 minutes');
}

function lockScreen() {
    exec('"/System/Library/CoreServices/Menu Extras/User.menu/Contents/Resources/CGSession" -suspend');
}

function startTimer(endtime) {
    interval = setInterval(function() {
        var minutesToGo = endtime.diff(moment(), 'minutes').toString();
        var secondsToGo = (endtime.diff(moment(), 'seconds') % 60).toString();
        var timeToGo = minutesToGo + ':' + secondsToGo + ' to go';
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(timeToGo);

        if (endtime.diff(moment(), 'seconds') <= 0) {
            clearInterval(interval);
            lockScreen();
        }
    }, 1000);
}

// while true; do echo -ne "`date`\r"; done
