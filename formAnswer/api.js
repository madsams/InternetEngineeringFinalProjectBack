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
    if(req.method.toString() !== "POST" && req.method.toString() !== "GET" && req.method.toString() !== "DELETE"){     
        log('error' , `${req.method} is not correct for ${req.originalUrl}`);
        return res.status(400).json({message: "Bad Request (request method error)"});
    }
    next();
});

router.get('/' , (req , res)=>{
    service.findAllAnswers().then(result=>{
        return res.status(result.status).json(result.body);
    })
    .catch(err =>{
        return res.status(err.status).json(err.body);
    });
});

router.post('/:id' , (req , res)=> {
    let answer = req.body;
    const id = req.params.id;
    answer['values'] = {...answer};
    answer['formId'] = id;
    answer['createdAt'] = new Date();
    answer['userId'] = req.user.sub;
    const resultPromise = service.createFormAnswer(answer);
    resultPromise.then(result => {
        return res.status(result.status).json(result.body);
    })
    .catch(err => {
        return res.status(err.status).json(err.body);
    });
});

router.get('/:id' , (req , res) => {
    const id = req.params.id;
    service.findAnswer(id)
    .then(answer=>{
        return res.status(answer.status).json(answer.body);
    })
    .catch(err=>{
        return res.status(err.status).json(err.body);
    })
});


// router.delete('/:id' , (req , res) => {
//     const id = req.params.id;
//     service.deleteFormAnswer(id)
//     .then(answer=>{
//         return res.status(answer.status).json(answer.body);
//     })
//     .catch(err=>{
//         return res.status(err.status).json(err.body);
//     })
// });


module.exports = router;