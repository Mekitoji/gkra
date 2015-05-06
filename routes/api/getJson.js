var _ = require("lodash");
var Apps = require("../../models/CIS/gkbase");
var AppsEU = require("../../models/EU/gkbase");
var AppsSandbox = require("../../models/Sandbox/gkbase");
var AppsSIA = require("../../models/SIA/gkbase");
var Cal = require("../../models/CIS/calendar");
var CalEU = require("../../models/EU/calendar");
var CalSandbox = require("../../models/Sandbox/calendar");
var CalSIA = require("../../models/SIA/calendar");

var getCurrentYear = function () {
  var date = new Date();
  return date.getFullYear();
};

// need to refactoring
// TODO: check region first, inherit
// object methods and then do something
module.exports = function (app) {
  app.post("/api/getJson", function (req, res) {
    var headerArr = ["empty", "appId", "region", "gk", "appName", "seller", "updateDate", "appStatus", "gkReview"];
    var tempArr = [];

    if (req.body.region === "CS" && req.body.table_caption === "Gate Keeper Review List") {
      var objectX = JSON.parse(req.body.data);

      _.forEach(objectX, function (arr) {
        tempArr.push(_.zipObject(headerArr, arr));
      });
      _.forEach(tempArr, function (n) {
        Apps.findOne({
          applicationId: n.appId
        })

        .exec(function (err, app) {
          if (err) {
            res.json({
              "result": false,
              "data": err
            });
          }

          if (app === null && n.appStatus !== "App QA approved" || app.year != getCurrentYear() && n.appStatus !== "App QA approved") { //check
            var gk = {
              "POLITAEVDMITRY": "DP",
              "SayantsAndrey": "AS",
              "EgorovVladimir": "VE",
              "KirillovYury": "YK"
            };

            var resp = gk[n.gk] ? gk[n.gk] : "";

            Apps.create({
              appName: n.appName,
              seller: n.seller,
              sdpStatus: n.appStatus,
              tv: "In Progress",
              testCycles: 1,
              updateTime: n.updateDate,
              replyTime: 0,
              resp: resp,
              applicationId: n.appId,
              year: getCurrentYear()
            }, function (err, resultA) {
              if (err) {
                res.json({
                  "result": false,
                  "data": err
                });
              }
              Cal.create({
                appId: resultA._id
              }, function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          } else if (app !== null && app.year == n.year) {
            Apps.findOne({
              applicationId: n.appId
            })

            .exec(function (err, app) {
              if (err) {
                res.json({
                  "result": false,
                  data: err
                });
              }
              var gk = {
                "POLITAEVDMITRY": "DP",
                "SayantsAndrey": "AS",
                "EgorovVladimir": "VE",
                "KirillovYury": "YK"
              };

              var resp = gk[n.gk] ? gk[n.gk] : "";

              n.updateDate = new Date(n.updateDate);
              app.sdpStatus = n.appStatus;
              app.updateTime = n.updateDate;
              app.appName = n.appName;
              app.resp = resp;
              app.save(function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          }
        });
      });

    } else if (req.body.region === "EU" && req.body.table_caption === "Gate Keeper Review List") {

      var objEU = JSON.parse(req.body.data);

      _.forEach(objEU, function (arr) {
        tempArr.push(_.zipObject(headerArr, arr));
      });
      _.forEach(tempArr, function (n) {
        AppsEU.findOne({
          applicationId: n.appId
        })

        .exec(function (err, app) {
          if (err) {
            res.json({
              "result": false,
              "data": err
            });
          }

          if (app === null && n.appStatus !== "App QA approved" || app.year != getCurrentYear() && n.appStatus !== "App QA approved") {
            AppsEU.create({
              appName: n.appName,
              seller: n.seller,
              sdpStatus: n.appStatus,
              tv: "In Progress",
              testCycles: 1,
              updateTime: n.updateDate,
              replyTime: 0,
              applicationId: n.appId
            }, function (err, resultA) {
              if (err) {
                res.json({
                  "result": false,
                  "data": err
                });
              }
              CalEU.create({
                appId: resultA._id
              }, function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          } else if (app !== null && app.year == n.year) {
            AppsEU.findOne({
              applicationId: n.appId
            })

            .exec(function (err, app) {
              if (err) {
                res.json({
                  "result": false,
                  data: err
                });
              }

              n.updateDate = new Date(n.updateDate);
              app.sdpStatus = n.appStatus;
              app.updateTime = n.updateDate;
              app.save(function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          }
        });
      });
    } else if (req.body.region === "all" && req.body.table_caption === "Gate Keeper Review List") {

      var objAll = JSON.parse(req.body.data);

      _.forEach(objAll, function (arr) {
        tempArr.push(_.zipObject(headerArr, arr));
      });
      _.forEach(tempArr, function (n) {
        AppsSandbox.findOne({
          applicationId: n.appId
        })

        .exec(function (err, app) {
          if (err) {
            res.json({
              "result": false,
              "data": err
            });
          }

          if (app === null && n.appStatus !== "App QA approved" || app.year != getCurrentYear() && n.appStatus !== "App QA approved") {
            AppsSandbox.create({
              appName: n.appName,
              seller: n.seller,
              sdpStatus: n.appStatus,
              tv: "In Progress",
              testCycles: 1,
              updateTime: n.updateDate,
              replyTime: 0,
              applicationId: n.appId
            }, function (err, resultA) {
              if (err) {
                res.json({
                  "result": false,
                  "data": err
                });
              }
              CalSandbox.create({
                appId: resultA._id
              }, function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          } else if (app !== null && app.year == n.year) {
            AppsSandbox.findOne({
              applicationId: n.appId
            })

            .exec(function (err, app) {
              if (err) {
                res.json({
                  "result": false,
                  data: err
                });
              }

              n.updateDate = new Date(n.updateDate);
              app.sdpStatus = n.appStatus;
              app.updateTime = n.updateDate;
              app.save(function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          }
        });
      });
    } else if ((req.body.region === "AA" ||
        req.body.region === "HK" ||
        req.body.region === "MA" ||
        req.body.region === "NA" ||
        req.body.region === "TW") &&
      req.body.table_caption === "Gate Keeper Review List") {

      var objSIA = JSON.parse(req.body.data);

      _.forEach(objSIA, function (arr) {
        tempArr.push(_.zipObject(headerArr, arr));
      });
      _.forEach(tempArr, function (n) {
        AppsSandbox.findOne({
          applicationId: n.appId
        })

        .exec(function (err, app) {
          if (err) {
            res.json({
              "result": false,
              "data": err
            });
          }

          if (app === null && n.appStatus !== "App QA approved" || app.year != getCurrentYear() && n.appStatus !== "App QA approved") {
            AppsSIA.create({
              appName: n.appName,
              seller: n.seller,
              sdpStatus: n.appStatus,
              tv: "In Progress",
              testCycles: 1,
              updateTime: n.updateDate,
              replyTime: 0,
              applicationId: n.appId
            }, function (err, resultA) {
              if (err) {
                res.json({
                  "result": false,
                  "data": err
                });
              }
              CalSIA.create({
                appId: resultA._id
              }, function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          } else if (app !== null && app.year == n.year) {
            AppsSIA.findOne({
              applicationId: n.appId
            })

            .exec(function (err, app) {
              if (err) {
                res.json({
                  "result": false,
                  data: err
                });
              }

              n.updateDate = new Date(n.updateDate);
              app.sdpStatus = n.appStatus;
              app.updateTime = n.updateDate;
              app.save(function (err, result) {
                if (err) {
                  res.json({
                    "result": false,
                    "data": err
                  });
                }
                res.json({
                  "result": true,
                  "data": result
                });
              });
            });
          }
        });
      });
    } else {
      res.json({
        "result": false,
        "data": "Can't find this region."
      });
    }
  });
};