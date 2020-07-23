const express = require("express");
const router = express.Router();
const passport = require("passport");
const util = require("util");
const url = require("url");
const querystring = require("querystring");
const auth0 = require('auth0-js');

require("dotenv").config();

// var webAuth = new auth0.WebAuth({
//     domain:       'ieng-final-project.eu.auth0.com',
//     clientID:     process.env.AUTH0_CLIENT_ID
//   });

  var webAuth = new auth0.WebAuth({
    domain:       'ieng-final-project.eu.auth0.com',
    clientID:     'cnVc6ItQYtXKnqrx8VFtAxm2M06z2Ddg'
  });



router.get('/v2/login', (req, res, next) => {
  // Trigger login with google
  webAuth.authorize({
    connection: 'google-oauth2'
  });
});


router.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile"
  })
);

router.get("/callback", (req, res, next) => {
  passport.authenticate("auth0", {
    scope: "openid email profile"
  }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || "/");
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();

  let returnTo = req.protocol + "://" + req.hostname;
  const port = req.connection.localPort;

  if (port !== undefined && port !== 80 && port !== 443) {
    returnTo =
      process.env.NODE_ENV === "production"
        ? `${returnTo}/`
        : `${returnTo}:${port}/`;
  }

  const logoutURL = new URL(
    util.format("https://%s/logout", process.env.AUTH0_DOMAIN)
  );
  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo
  });
  logoutURL.search = searchString;

  res.redirect(logoutURL);
});


module.exports = router;
