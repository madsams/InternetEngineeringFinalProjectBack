require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const log = require('./logger/logger');
const cors = require("cors");
let path = require('path');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');
const port = process.env.PORT || 8000;
const app = express();

app.use(body_parser.json());

app.use(express.json());

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const session = {
  secret: process.env.AUTH0_SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
};

app.use(expressSession(session));

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL:
      process.env.AUTH0_CALLBACK_URL || "http://localhost:3000/callback"
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    return done(null, profile);
  }
);
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,DELETE"
    );
    res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin,Cache-Control,Accept,X-Access-Token ,X-Requested-With, Content-Type, Access-Control-Request-Method"
    );
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
});

const secured = (req, res, next) => {
  req.user = myUser;
  if (req.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
};

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});


const auth_api = require('./authentication/auth');
app.use("/", auth_api);

app.use(secured);

const user = require('./user/routes');
app.use("/api/users" , user);

const forms_api = require('./form/api');
app.use("/api/forms" , forms_api);

const form_answer = require('./formAnswer/api');
app.use('/api/form-answers', form_answer);

const areas_api = require('./area/api');
app.use('/api/areas' , areas_api);

app.use(function(req, res) {
      log('error' , `url: ${req.url} not found.`);
      // console.log(req.headers['user-agent']);
	    return res.status(404).json({message: `url: ${req.url} Not found.`});
});

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.rbxbu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false  })
  .then(() => {
    app.listen(port , function(){
        log('info',`app started at port ${port}`);
    });
  })
  .catch(err => {
    log('error' , err)
  });


module.exports = app;