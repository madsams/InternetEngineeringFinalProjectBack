// lib/middleware/secured.js

module.exports = function () {
  return function secured (req, res, next) {
    if (req.user) { return next(); }
    // if (user doesn't have a role redirect to assign roles page){
    	// res.redirect('/roles/assing');
    // }
    req.session.returnTo = req.originalUrl;
    res.redirect('/login');
  };
};