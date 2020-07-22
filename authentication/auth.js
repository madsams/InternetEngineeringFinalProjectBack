const express = require("express");
const router = express.Router();
const passport = require("passport");
const util = require("util");
const url = require("url");
const querystring = require("querystring");

require("dotenv").config();

router.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile"
  }),
  (req, res) => {
    let returnTo = req.query.returnTo;
    console.log('login');
    console.log(returnTo);
    res.redirect(returnTo || "/");
  }
);

router.get("/callback", (req, res, next) => {
  console.log('callback');
  passport.authenticate("auth0", (err, user, info) => {
    if (err) {
      console.log('callback error');
      return next(err);
    }
    if (!user) {
      console.log('call back redirect to login');
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        console.log('error req.login');
        return next(err);
      }
      const returnTo = req.session.returnTo;
      console.log('req.login redirect');
      console.log(returnTo);
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