const express = require('express');
const axios = require('axios');
const getUserRoles = require('./roles');
const log = require('../logger/logger');
var defaultRoles = require("./defaultRoles");


router = express.Router();
AUTH0_MGMT_API_ACCESS_TOKEN = process.env.AUTH0_MGMT_API_ACCESS_TOKEN;

const roles = defaultRoles;

let apiManagementHeaders = {
	headers: {
		Authorization: `Bearer ${AUTH0_MGMT_API_ACCESS_TOKEN}`
	}
}

router.get('/roles', (req, res) => {
	getUserRoles(req.user.sub).then((result) =>{
		console.log(result);
		return res.status(200).json(result.data);
	}).catch((err)=> {
		console.log(err);
		res.status(500).json(err);
	});
});

router.get('/test', (req, res) => {
	updateAccessToken().then(result => {
		res.status(200).json(result);
	}).catch(err => {
		console.log(err);
		res.status(500).json(err);
	})
})


module.exports = router;
