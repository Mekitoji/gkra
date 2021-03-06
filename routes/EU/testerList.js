var routesFunction = require('../../libs/routesFunction');
var TesterStat = require('../../models/EU/testerStat');
var ObjectId = require('mongoose').Types.ObjectId;
var User = require('../../models/user');
var Cal = require('../../models/EU/calendar');
var Apps = require('../../models/EU/gkbase');
var _ = require('lodash');

module.exports = function (app) {
  app.get('/eu/:year/tester', routesFunction.checkPermissionEU, function (req, res) {
    TesterStat.find({})
      .populate('user')
      .exec(function (err, testers) {
        if (err) res.send(err);
        TesterStat.populate(testers, {
          path: 'appStorage.app',
          model: 'AppsEU'
        }, function (err, data) {
          if (err) res.send(err);
          res.locals.testers = data;
          res.locals.year = req.params.year;
          res.locals.path = req.path;
          res.render('testerList.ejs', {
            user: req.user
          });
        });
      });
  });
}