#!/usr/bin/env node

'use strict';

const os = require('os');
const say = require('say');
const moment = require('moment');
const clear = require('clear');
const shell = require('shelljs');

const app = require('./package');

var interval, args = process.argv;
var timeDefined = args.length >= 4 && Number.isInteger(Number(args[2]));
var helpRequired = args.length === 3 && args[2] === '--help';
const sayFlag = args[4] == '-say' ? true : false;

if (timeDefined) {
    var finishingAt = moment().add(Number(args[2]), args[3]);
    var fiveSecondsLater = moment().add(5, 'seconds');

    if (finishingAt.isBefore(fiveSecondsLater)) {
        console.log('I think you gave me an invalid timeframe there...');
    } else {
        startTimer(finishingAt);
    }
} else if (helpRequired) {
    printHelp();
} else {
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
  if (sayFlag) {
    say.speak('5 seconds to break time.');
  }
  if (os.platform() == 'win32') {
    // Windows
  	setTimeout(function() {
  		shell.exec('rundll32.exe user32.dll,LockWorkStation');
  	}, 5000);
  } else if (os.platform() == 'darwin') {
  	// macOS
  	setTimeout(function() {
  		shell.exec('"/System/Library/CoreServices/Menu Extras/User.menu/Contents/Resources/CGSession" -suspend');
  	}, 5000);
  } else {
    console.log("Sorry, your operating system isn't supported yet :(");
    console.log("Feel free to submit an issue or a pull request on GitHub.");
    console.log("https://github.com/nadeesha/breaktime");
  }
}

// clear the console
function clearWindow() {
  if (os.platform() == 'win32') {
    shell.exec('cls');
  } else {
    shell.exec('clear');
  }
}

function startTimer(endtime) {
    clearWindow();
    console.log('Breaktime | Take breaks.');
    console.log('-----------------------------------------------');
    interval = setInterval(function() {
        var minutesToGo = endtime.diff(moment(), 'minutes').toString();
        var secondsToGo = (endtime.diff(moment(), 'seconds') % 60).toString();
        let secondZero = secondsToGo < 10 ? '0' : '';
        var timeToGo = minutesToGo + ':' + secondZero + secondsToGo + ' to go';
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(timeToGo);

        if (endtime.diff(moment(), 'seconds') <= 0) {
            clearInterval(interval);
            lockScreen();
        }
    }, 1000);
}
