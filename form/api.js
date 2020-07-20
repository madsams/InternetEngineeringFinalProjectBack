const express = require('express');
const log = require('./../logger/logger');
const service = require('./service');
const {check, validationResult} = require('express-validator');

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

router.get('/' , (req , res)=> {
    let resultPromise = service.getForms();
    resultPromise.then(result =>{
        return res.status(result.status).json(result.body);
    })
    .catch(err=>{
        return res.status(err.status).json(err.body);
    });
});

router.post('/' , (req , res)=> {
    const form = req.body;
    form.createdAt = new Date();
    form.answersCount = 0;
    let resultPromise = service.createForm(form);
    resultPromise.then(result =>{
        return res.status(result.status).json(result.body);
    })
    .catch(err=>{
        return res.status(err.status).json(err.body);
    });
});

router.get('/:id' , (req , res) => {
    const id = req.params.id;
    let resultPromise = service.getForm(id);
    resultPromise.then(result =>{
        return res.status(result.status).json(result.body);
    })
    .catch(err=>{
        return res.status(err.status).json(err.body);
    });
});

module.exports = router;