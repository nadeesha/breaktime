#!/usr/bin/env node

'use strict';

require('shelljs/global');
var moment = require('moment');
var _ = require('lodash');
var app = require('./package');

var interval, args = process.argv;
var timeDefined = args.length === 4 && _.isNumber(Number(args[2]));
var helpRequired = args.length === 3 && args[2] === '--help';

if (timeDefined) {
    var finishingAt = moment().add(Number(args[2]), args[3]);
    var fiveSecondsLater = moment().add(5, 'seconds');

    if (finishingAt.isBefore(fiveSecondsLater)) {
        console.log('I think you gave me an invalid timeframe there...');
    } else {
        exec('clear');
        startTimer(finishingAt);
    }
} else if (helpRequired) {
    printHelp();
} else {
    exec('clear');
    var finishingAt = moment().add(45, 'minutes');
    startTimer(finishingAt);
}

function printHelp() {
    console.log([app.name, app.version, '\n'].join(' '));
    console.log('usage:   breaktime [amount timeunit]');
    console.log('example: breaktime 45 minutes \n');
    console.log('NOTE: In absence of defined time, \nbreaktime will default to 45 minutes');
}

function lockScreen() {
    exec('say -v Daniel "5 seconds to break time"');

    setTimeout(function () {
        exec('"/System/Library/CoreServices/Menu Extras/User.menu/Contents/Resources/CGSession" -suspend');
    }, 5000);
}

function startTimer(endtime) {
    console.log('I will lock your screen when the timer runs out');
    console.log('-----------------------------------------------');
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