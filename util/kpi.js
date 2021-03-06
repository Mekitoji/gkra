var mongoose = require('../libs/mongoose');
var Apps = require('../models/CIS/gkbase');
var ApprovedApps = require('../models/CIS/gkbaseApproved');
var Calendar = require('../models/CIS/calendar');
var ApprovedCalendar = require('../models/CIS/calendarForApprovedApps');
var async = require('async');
var testerStat = require('../models/CIS/testerStat');
var _ = require('lodash');
var count = 0;

process.stdin.setRawMode(true);
process.stdin.resume();
process.stdin.setEncoding('utf8');

var countReplyTime = function (storage) {
  var justL = 0,
    withHiddenL = 0,
    replyTime = 0;
  for (var i = 0; i < storage.length; i++) {
    if (storage[i].value === 'L' || storage[i].value === 'LL') {
      withHiddenL++;
    }
    if (storage[i].value === 'L') {
      justL++;
    }
  }
  replyTime = withHiddenL / justL;
  if (replyTime === Infinity || isNaN(replyTime)) {
    replyTime = 0;
  }
  return replyTime;
};


async.waterfall([

    function (cb) {
      Apps.find({})
        .exec(function (err, apps) {
          if (err) {
            console.log("gate 1 screw up");
            cb(err);
          }
          cb(null, apps);
        });
    },
    function (apps, cb) {
      var temp = {};
      _.forEach(apps, function (n, key) {
        Calendar.findOne({
          "appId": n._id
        })

        .exec(function (err, cal) {
          if (err) {
            console.log("gate 2 screw up");
            cb(err);
          }
          if (cal !== null && cal.storage.length !== 0) {
            var resp = n.resp;
            cal = cal.toObject();
            n = n.toObject();
            cal.n = n;

            cal.storage = _.forEach(cal.storage, function (j) {
              if (j.value === undefined) {
                delete j;
              }
              if (j._id !== null) {
                delete j["_id"];
              }
            });
            if (temp[resp] !== null && temp[resp] !== undefined) {
              temp[resp].push(cal);
            } else {
              temp[resp] = [];
              temp[resp].push(cal);
            }
            // console.log(temp);
          } else if (cal === null) {
            //make request to approved collection
          }
        })
      });
      console.log("working...");
      setTimeout(function () {
    cb(null, temp);
      }, 5000);
    },
    function (cal, cb) {
      console.log(cal);
      var respArray = [];
      _.forEach(cal, function (d, key) {
        respArray.push(key);
      });
      console.log(respArray);

      async.map(respArray, function (resp) {
        testerStat.findOne({
          "name": resp
        })

        .exec(function (err, tester) {
          if (err) {
            console.log("gate 5 screw up");
            cb(err);
          }
          tester.appStorage = _.forEach(tester.appStorage, function (d) {
            _.forEach(cal[resp], function (s) {
              if (d.app.toString() === s.n._id.toString()) {
                d.respStorage = s.storage;
                d.respTime = countReplyTime(s.storage);
                count++;
              }
            });
          });
          cb(null, tester);
        });
      });
    }
  ],
  function (err, result) {
    if (err) return console.error(err);
    result.markModified("appStorage");
    result.save(function (err, res) {
      if (err) {
        console.error("Bull shit!");
      }
      console.log(res);
    })
    process.stdin.on('data', function (key) {
      if (key) {
        process.stdout.write(count + " storage was changed.\n");
        process.stdout.write("Goodbye!");
        process.exit();
      }
    });
  });