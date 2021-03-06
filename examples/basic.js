// Generated by CoffeeScript 1.6.3
var ccSvc, envir, fs;

fs = require('fs');

ccSvc = require('../src/ccxmleventemitter');

/*
scenario:
---------
EnvIR with IAM's on sensor 1,2,3 and Optismart linked to 0 and 9 (data)
connected to linux usb serial port /dev/ttyUSB0
*/


envir = new ccSvc.CurrentCost128XMLBaseStation('/dev/ttyUSB0', {
  useOSTime: true,
  debug: false,
  emitBaseEvery: 30,
  reading: {
    '9': 1000.000
  },
  spikeThreshold: 60
});

console.log("Instance version: " + (envir.version()));

envir.on('base', function(eventinfo) {
  return console.log("This base station is using " + eventinfo.src + " firmware and has been running for " + eventinfo.dsb + " days. The temperature is currently " + eventinfo.temp);
});

envir.on('sensor', function(eventinfo) {
  if (eventinfo.sensor === '0') {
    console.log("Whole House consumption reported as  " + eventinfo.watts + " watts");
  }
  if ((eventinfo.sensor !== '0') && (eventinfo.watts > 0)) {
    return console.log("IAM " + eventinfo.sensor + " reported as  " + eventinfo.watts + " watts");
  }
});

envir.on('impulse', function(eventinfo) {
  return console.log("There have been " + eventinfo.value + " impulses on sensor " + eventinfo.sensor + " since the sensor was powered on");
});

envir.on('impulse-reading', function(eventinfo) {
  return console.log("Sensor " + eventinfo.sensor + " reports a reading of " + eventinfo.reading + " accumulated since: " + ((new Date(eventinfo.timeFrom)).toLocaleString()));
});

envir.on('impulse-delta', function(eventinfo) {
  return console.log("There have been " + eventinfo.delta + " impulses on sensor " + eventinfo.sensor + " since the last reported event");
});

envir.on('impulse-avg', function(eventinfo) {
  return console.log("Sensor " + eventinfo.sensor + " reports an average consumption of " + eventinfo.avg + " units since last reported event");
});

envir.on('impulse-spike', function(eventinfo) {
  var data;
  data = "" + ((new Date()).toLocaleTimeString()) + " Sensor " + eventinfo.sensor + " Spiked with pulses of " + eventinfo.spike + " units since last reported event";
  console.log(data);
  if (typeof logfile !== "undefined" && logfile !== null) {
    return fs.appendFileSync(logfile, data);
  }
});

envir.on('impulse-correction', function(eventinfo) {
  var data;
  data = "" + ((new Date()).toLocaleTimeString()) + " Sensor " + eventinfo.sensor + " has had a reading reset to " + eventinfo.newReading + " and a new delta calculated of " + eventinfo.newDelta;
  console.log(data);
  if (typeof logfile !== "undefined" && logfile !== null) {
    return fs.appendFileSync(logfile, data);
  }
});

envir.on('impulse-warning', function(eventinfo) {
  var data;
  data = "" + ((new Date()).toLocaleTimeString()) + " Sensor " + eventinfo.sensor + " has had a reading reset to last valid reading of " + eventinfo.newReading + " due to spike with no correction data applied";
  console.log(data);
  if (typeof logfile !== "undefined" && logfile !== null) {
    return fs.appendFileSync(logfile, data);
  }
});

process.on('SIGINT', function() {
  console.log("\ngracefully shutting down from  SIGINT (Crtl-C)");
  envir.close();
  envir = null;
  console.log("--EXIT--");
  return process.exit(0);
});
