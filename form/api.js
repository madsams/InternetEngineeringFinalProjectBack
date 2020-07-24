const express = require('express');
const log = require('./../logger/logger');
const service = require('./service');
const {setInCache , checkCache} = require('./../cache/redis');
const permit = require('../security/checkPermission');
const roles = require('./../security/roles');
const router = express.Router();


router.use(function(req, res, next) {
    log('info' , `new ${req.method} request on ${req.originalUrl}`);
    if(req.method.toString() !== "POST" && req.method.toString() !== "GET"  && req.method.toString() !== "DELETE"){     
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

router.post('/' , permit(roles.ADMIN) ,(req , res)=> {
    const form = req.body;
    form.createdAt = new Date();
    let resultPromise = service.createForm(form);
    resultPromise.then(result =>{
        return res.status(result.status).json(result.body);
    })
    .catch(err=>{
        return res.status(err.status).json(err.body);
    });
});


router.get('/:id/form-answers', permit(roles.ADMIN , roles.CONTROL_CENTER_AGENT) , (req , res)=>{
    const id = req.params.id;
    let filter;
    try{
        if (req.query.filter)   
            filter = JSON.parse(req.query.filter);
    }
    catch(err){
        return res.status(422).json({message:'filter is not json'});
    }
    let resultPromise = service.getFormAnswers(id , filter);
    resultPromise.then(result =>{
        return res.status(result.status).json(result.body);
    })
    .catch(err=>{
        return res.status(err.status).json(err.body);
    });
})

router.get('/:id',permit(roles.ADMIN , roles.FIELD_AGENT) , checkCache(undefined), (req , res) => {
    const id = req.params.id;
    let resultPromise = service.getForm(id);
    resultPromise.then(result =>{
        setInCache(id , result.body);
        return res.status(result.status).json(result.body);
    })
    .catch(err=>{
        return res.status(err.status).json(err.body);
    });
});

router.delete('/:id' , permit(roles.ADMIN) ,(req , res)=>{
    const id = req.params.id;
    let resultPromise = service.deleteForm(id);
    resultPromise.then(result =>{
        return res.status(result.status).json(result.body);
    })
    .catch(err=>{
        return res.status(err.status).json(err.body);
    });
});

module.exports = router;