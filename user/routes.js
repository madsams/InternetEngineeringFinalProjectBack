const express = require('express');
const axios = require('axios');
const getUserRoles = require('./roles');
const jwtAuthz = require("express-jwt-authz");
const service = require('./../formAnswer/service');
const permit = require('../security/checkPermission');
const roles = require('./../security/roles');
const { FIELD_AGENT } = require('./../security/roles');
const router = express.Router();
AUTH0_MGMT_API_ACCESS_TOKEN = process.env.AUTH0_MGMT_API_ACCESS_TOKEN;

let apiManagementHeaders = {
  headers: {
    Authorization: `Bearer ${AUTH0_MGMT_API_ACCESS_TOKEN}`
  }
};

router.get('/roles', (req, res) => {
	getUserRoles(req.user.sub).then((result) =>{
		console.log(result);
		return res.status(200).json(result);
	}).catch((err)=> {
		console.log(err);
		res.status(500).json(err);
	});
});

router.get('/form-answers', permit(roles.FIELD_AGENT) ,(req , res)=>{
	service.findAllAnswers(req.user.sub).then(result=>{
		return res.status(result.status).json(result.body);
	}).catch(err=>{
		return res.status(err.status).json(err.body);
	});
})



module.exports = router;
