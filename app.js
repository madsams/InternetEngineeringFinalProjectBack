require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const log = require('./logger/logger');
const cors = require("cors");
let path = require('path');
const mongoose = require('mongoose');

const port = process.env.PORT || 8000;
const app = express();

app.use(body_parser.json());

app.use(express.json());

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

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



app.use(function(req, res) {
	    log('error' , `url: ${req.url} not found.`);
	    return res.status(404).json({message: `url: ${req.url} Not found.`});
});

const connectionString = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.rbxbu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose
  .connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(port , function(){
        log('info',`app started at port ${port}`);
    });
  })
  .catch(err => {
    log('error' , err)
  });

