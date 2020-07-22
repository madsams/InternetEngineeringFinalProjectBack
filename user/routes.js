const express = require('express');
const axios = require('axios');
const getRoles = require('./roles');
const log = require('../logger/logger');
var defaultRoles = require("./defaultRoles");

router = express.Router();
AUTH0_MGMT_API_ACCESS_TOKEN = process.env.AUTH0_MGMT_API_ACCESS_TOKEN;

const roles = defaultRoles;

// log('out');
// log(roles);

let apiManagementHeaders = {
	headers: {
		Authorization: `Bearer ${AUTH0_MGMT_API_ACCESS_TOKEN}`
	}
}

// router.get('/roles', (req, res) => {
// 	getRoles().then(roles=>{
// 		return res.status(200).json(roles);
// 	})
// });

router.get('/roles', (req, res) => {
	log('info' , req.user);
	log('info' , `id: ${req.user.id}`);
	let url = `https://ieng-final-project.eu.auth0.com/api/v2/users/${req.user.id}/roles`;
	axios.get(url,apiManagementHeaders).then((result) =>{
		return res.status(200).json(result);
	}).catch((err)=> {
		res.status(400).json(err);
	});
});


module.exports = router;