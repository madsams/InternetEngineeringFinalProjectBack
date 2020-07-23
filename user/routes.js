const express = require('express');
const axios = require('axios');
const jwtAuthz = require("express-jwt-authz");
const getRoles = require('./roles');
const log = require('../logger/logger');
var defaultRoles = require("./defaultRoles");

router = express.Router();
AUTH0_MGMT_API_ACCESS_TOKEN = process.env.AUTH0_MGMT_API_ACCESS_TOKEN;

const roles = defaultRoles;

let apiManagementHeaders = {
  headers: {
    Authorization: `Bearer ${AUTH0_MGMT_API_ACCESS_TOKEN}`
  }
};

router.get('/roles', (req, res) => {
  let userId = req.user.sub.split('|')[1];
  let url = `https://ieng-final-project.eu.auth0.com/api/v2/users/${userId}/roles`;
  axios.get(url, apiManagementHeaders).then((result) => {
    console.log(result);
    return res.status(200).json(result.data);
  }).catch((err) => {
    console.log(err);
    console.log(url);
    res.status(400).json(err);
  });
});


module.exports = router;
