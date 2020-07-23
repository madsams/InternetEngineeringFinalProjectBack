require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const log = require('./logger/logger');
const cors = require("cors");
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const port = process.env.PORT || 8000;
const app = express();
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 60,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience:  process.env.AUTH0_CLIENT_ID,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(cookieParser(process.env.AUTH0_SESSION_SECRET));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(checkJwt);

const user = require('./user/routes');
app.use("/api/users", user);

const forms_api = require('./form/api');
app.use("/api/forms", forms_api);

const form_answer = require('./formAnswer/api');
app.use('/api/form-answers', form_answer);

const areas_api = require('./area/api');
app.use('/api/areas', areas_api);

app.use(function (req, res) {
  log('error', `url: ${req.url} not found.`);
  // console.log(req.headers['user-agent']);
  return res.status(404).json({message: `url: ${req.url} Not found.`});
});

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.rbxbu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
  .then(() => {
    app.listen(port, function () {
      log('info', `app started at port ${port}`);
    });
  })
  .catch(err => {
    log('error', err)
  });


module.exports = app;
