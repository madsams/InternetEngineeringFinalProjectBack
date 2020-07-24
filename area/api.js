const express = require('express');
const log = require('./../logger/logger');
const service = require('./service');
const {check, validationResult} = require('express-validator');
const checks = [check('lng').isFloat(),check('lat').isFloat()];
const permit = require('../security/checkPermission');
const roles = require('./../security/roles');
const router = express.Router();
const errorFormatter = ({ location, msg, param}) => {
    return ` ${param} -> ${msg} `;
};

router.use(function(req, res, next) {
    log('info' , `new ${req.method} request on ${req.originalUrl}`);
    if(req.method.toString() !== "POST" && req.method.toString() !== "GET"){     
        log('error' , `${req.method} is not correct for ${req.originalUrl}`);
        return res.status(400).json({message: "Bad Request (request method error)"});
    }
    next();
});

router.get('/testpoint',permit(roles.ADMIN , roles.FIELD_AGENT), checks, function(req, res) {
    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()){
        log('error' , `${errors.array()}`);
	    return res.status(422).json({message: "Bad Request (params error)"});
    }
	const point = [req.query.lng, req.query.lat];
	service.getCoveredAreas(point).then((result) =>{
        return res.status(result.status).json(result.body);
    })
    .catch(err=>{
        return res.status(err.status).json(err.body);
    });
});

router.get('/', permit(roles.ADMIN , roles.CONTROL_CENTER_AGENT) ,(req , res)=>{
    service.getAreas().then(result=>{
        return res.status(result.status).json(result.body);
    })
    .catch(err=>{
        return res.status(err.status).json(err.body);
    });
});

router.post('/', permit(roles.ADMIN) , (req , res)=>{
    const area = req.body;
    service.addArea(area).then(result=>{
        return res.status(result.status).json(result.body);
    }).catch(err=>{
        return res.status(err.status).json(err.body);
    });
});

module.exports = router;