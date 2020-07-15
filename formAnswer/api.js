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
    service.findAllAnswer().then(result=>{
        return res.status(200).json(result.map(answer => {
                return answer.toJSON();
        }));
    }).catch(err=>{
        log('error' , err);
        return res.status(500).json({message: "Internal Server Error"});
    });
});

router.post('/:id' , (req , res)=> {
    let answer = req.body;
    const id = req.params.id;
    answer['formId'] = id;
    const resultPromise = service.createFormAnswer(answer);
    if (resultPromise){
        resultPromise.then(result => {
            log('info', JSON.stringify(result.toJSON()));
            return res.status(200).json(result.toJSON());
        })
        .catch(err => {
            log('error' , err);
            return res.status(400).json({message: "Bad Request (request method error)"});
        });
    }else{
        return res.status(400).json({message: "Bad Request (request method error)"});
    }
});

router.get('/:id' , (req , res) => {
    const id = req.params.id;
    service.findAnswer(id).then(answer=>{
        if (answer){
            log('info', `find answer with id= ${id}`);
            console.log(answer.toJSON());
            return res.status(200).json(answer.toJSON());
        }
        log('error', `not find answer with id= ${id}`);
        return res.status(400).json({message: "Bad Request (not found)"});
    }).catch(err=>{
        log('error' , err);
        return res.status(400).json({message: "Bad Request (not found)"});
    })
});

router.get('/form/:id' , (req , res)=> {
    const id = req.params.id;
    service.findFormAnswer(id).then(result => {
        return res.status(200).json(result.map(answer => {
            return answer.toJSON();
        }));
    })
    .catch(err=>{
        log('error' , err);
        return res.status(400).json({message: "Bad Request (not found)"});
    });
});



module.exports = router;