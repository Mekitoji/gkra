module.exports = function (app) {
  app.get('/global/mailSuccess', function (req, res, next) {
    res.locals.path = req.path;
    res.render('mailSuccess.ejs');
  });
};