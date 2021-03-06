// route middleware to make sure a user is logged in

//handle 401 error
var Unauthorized = function Unauthorized(response) {
  var err = new Error('Unauthorized: Access is denied');
  err.status = 401;
  response.status(401).render('401.ejs', {
    message: err.message,
    error: err
  });
};

//handle 403 error
var Forbidden = function Forbidden(response) {
  var err = new Error('Forbidden: You don\'t have permission to access this page');
  err.status = 403;
  response.render('403.ejs', {
    message: err.message,
    error: err
  });
};

//check perm for page
var checkPermFor = function checkPermFor(req, res, next) {
  var args = arguments;
  var access = false;
  if (req.isAuthenticated()) {
    for (var i = 3; i < args.length; i++) {
      if (req.user.local.group === args[i]) {
        access = true;
      }
    }
    if (access) {
      return next();
    } else {
      // 403 error
      Forbidden(res);
    }
  }
  // 401 error
  Unauthorized(res);
};

//check passport auth
function unAuth(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // 401 error
  Unauthorized(res);
}

//check user group
function checkPermission(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gkCIS', 'gkEU', 'gkCISEU');
}

function checkPermissionRoot(req, res, next) {
  checkPermFor(req, res, next, 'root');
}

function checkPermissionGkCIS(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gkCIS', 'gkCISEU');
}

function checkPermissionGkEU(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gkEU', 'gkCISEU');
}

function checkPermissionGkSIA(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gkSIA');
}

function checkPermissionCIS(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gkCIS', 'employerCIS', 'gkCISEU');
}

function checkPermissionCISEU(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gkCIS', 'gkEU', 'gkCISEU', 'employerCIS', 'employerEU', 'employerCISEU' );
}

function checkPermissionGkCISEU(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gkCIS', 'gkEU', 'gkCISEU');
}

function checkPermissionEU(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gkEU', 'employerEU', 'gkCISEU');
}

function checkPermissionSIA(req, res, next) {
  checkPermFor(req, res, next, 'root', 'gkSIA', 'employerSIA');
}

function checkPermissionSandbox(req, res, next) {
  checkPermFor(req, res, next, 'root', 'global');
}

// in libs or middleware&
function alreadyLoginIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/profile');
  } else {
    return next(); // load the index.ejs file
  }
}


exports.unAuth = unAuth;
exports.alreadyLoginIn = alreadyLoginIn;
exports.checkPermission = checkPermission;
exports.checkPermissionCIS = checkPermissionCIS;
exports.checkPermissionEU = checkPermissionEU;
exports.checkPermissionSIA = checkPermissionSIA;
exports.checkPermissionGkCIS = checkPermissionGkCIS;
exports.checkPermissionGkEU = checkPermissionGkEU;
exports.checkPermissionGkSIA = checkPermissionGkSIA;
exports.checkPermissionRoot = checkPermissionRoot;
exports.checkPermissionSandbox = checkPermissionSandbox;
exports.checkPermissionCISEU = checkPermissionCISEU;
exports.checkPermissionGkCISEU = checkPermissionGkCISEU;
