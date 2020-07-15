const express = require('express');
const log = require('../logger/logger');
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

router.get('/' , (req , res)=>{
    service.forms().then(result=>{
        return res.status(200).json(result.map(form => {
                return form.toJSON();
        }));
    }).catch(err=>{
        log('error' , err);
        return res.status(500).json({message: "Internal Server Error"});
    });
});

router.post('/' , (req , res)=> {
    const form = req.body;
    service.createForm(form) .then(result => {
        log('info', JSON.stringify(result.toJSON()));
        return res.status(200).json(result.toJSON());
    })
    .catch(err => {
        log('error' , err);
        return res.status(400).json({message: "Bad Request (request method error)"});
    });;
});

router.get('/:id' , (req , res) => {
    const id = req.params.id;
    service.form(id).then(form=>{
        if (form){
            log('info', `find form with id= ${id}`);
            console.log(form.toJSON());
            return res.status(200).json(form.toJSON());
        }
        log('error', `not find form with id= ${id}`);
        return res.status(400).json({message: "Bad Request (not found)"});
    }).catch(err=>{
        log('error' , err);
        return res.status(400).json({message: "Bad Request (not found)"});
    })
});


module.exports = router;