const express = require('express');
const axios = require('axios');
const jwtAuthz = require("express-jwt-authz");
const getRoles = require('./roles');
const log = require('../logger/logger');
var defaultRoles = require("./defaultRoles");
const service = require('./../formAnswer/service');

const router = express.Router();
AUTH0_MGMT_API_ACCESS_TOKEN = process.env.AUTH0_MGMT_API_ACCESS_TOKEN;

const roles = defaultRoles;

let apiManagementHeaders = {
  headers: {
    Authorization: `Bearer ${AUTH0_MGMT_API_ACCESS_TOKEN}`
  }
};

router.get('/roles', (req, res) => {
  console.log('user', req.user);
  let url = `https://ieng-final-project.eu.auth0.com/api/v2/users/${req.user.sub}/roles`;
  axios.get(url, apiManagementHeaders).then((result) => {
    return res.status(200).json(result.data);
  }).catch((err) => {
    res.status(400).json(err);
  });
});

router.get('/form-answers', (req , res)=>{
	service.findAllAnswers(req.user.sub).then(result=>{
		return res.status(result.status).json(result.body);
	}).catch(err=>{
		return res.status(err.status).json(err.body);
	});
})



module.exports = router;
