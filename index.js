#!/usr/bin/env node

'use strict';

require('shelljs/global');

const os = require('os'); // access the operating system type
const say = require('say'); // a module for text-to-speech
const moment = require('moment'); // a module for date/time management
const _ = require('lodash'); // a module for utilities

const app = require('./package');

var interval, args = process.argv;
var timeDefined = args.length >= 4 && _.isNumber(Number(args[2]));
var helpRequired = args.length === 3 && args[2] === '--help';
const sayFlag = args[4] == '-say' ? true : false;

if (timeDefined) {
    var finishingAt = moment().add(Number(args[2]), args[3]);
    var fiveSecondsLater = moment().add(5, 'seconds');

    if (finishingAt.isBefore(fiveSecondsLater)) {
        console.log('I think you gave me an invalid timeframe there...');
    } else {
        clear();
        startTimer(finishingAt);
    }
} else if (helpRequired) {
    printHelp();
} else {
  clear();
  var finishingAt = moment().add(45, 'minutes');
  startTimer(finishingAt);
}

function printHelp() {
    console.log([app.name, app.version, '\n'].join(' '));
    console.log('usage:   breaktime [amount timeunit]');
    console.log('example: breaktime 45 minutes \n');
    console.log('NOTE: In absence of defined time, \nbreaktime will default to 45 minutes');
}

// clear the console
function clear() {
  if (os.platform() == 'win32') {
    exec('cls');
  } else {
    exec('clear');
  }
}

function lockScreen() {
  if (sayFlag) {
    say.speak('5 seconds to break time.');
  }

  if (os.platform() == 'win32') {
    // Windows
  	setTimeout(function() {
  		exec('rundll32.exe user32.dll,LockWorkStation');
  	}, 5000);
  } else if (os.platform() == 'darwin') {
  	// macOS
  	setTimeout(function() {
  		exec('"/System/Library/CoreServices/Menu Extras/User.menu/Contents/Resources/CGSession" -suspend');
  	}, 5000);
  } else {
    console.log("Sorry, your operating system isn't supported yet :(");
    console.log("Feel free to submit an issue or a pull request on GitHub.");
  }
}

function startTimer(endtime) {
    console.log('Breaktime | Take breaks.');
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
