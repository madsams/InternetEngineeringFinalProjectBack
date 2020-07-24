const express = require('express');
const getUserRoles = require('./roles');
const service = require('./../formAnswer/service');
const permit = require('../security/checkPermission');
const roles = require('./../security/roles');
const { checkCache , setInCache } = require('../cache/redis');
const router = express.Router();



router.get('/roles', (req, res) => {
	getUserRoles(req.user.sub).then((result) =>{
		console.log(result);
		return res.status(200).json(result);
	}).catch((err)=> {
		console.log(err);
		res.status(500).json(err);
	});
});

router.get('/form-answers', permit(roles.FIELD_AGENT) , checkCache('form_answers') ,(req , res)=>{
	service.findAllAnswers(req.user.sub).then(result=>{
		setInCache(`form_answers_${req.user.sub}` , result.body);
		return res.status(result.status).json(result.body);
	}).catch(err=>{
		return res.status(err.status).json(err.body);
	});
})



module.exports = router;
