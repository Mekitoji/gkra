module.exports = function (app) {
  app.get('/cis/:year/mailSuccess', function (req, res, next) {
    res.locals.path = req.path;
    res.locals.year = req.params.year;
    res.render('mailSuccess.ejs');
  });
};