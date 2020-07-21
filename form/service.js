const data = require('./data');
const log = require('./../logger/logger');
const sortJsonArray = require('sort-json-array');


let getForms = async () =>{
    let promise = new Promise((resolve , reject)=>{
        data.forms().then(forms=>{
            if (forms){
                let result = forms.map(form => {
                    let res = form.toJSON();
                    delete res.fields;
                    delete res.records;
                    return res;
                });
                log('info' , JSON.stringify(result));
                resolve({body: result , status:200});
            }
            else{
                log('error' , 'query failed');
                reject({body: {message:'query failed'}, status:500});
            }
        }).catch(err =>{
            log('error' , err);
            reject({body: {message:err} , status:400});
        });
    });
    return await promise;
};

let getForm = async (id) =>{
    let promise = new Promise((resolve , reject)=>{
        data.form(id).then(form=>{
            if (form){
                let result = form.toJSON();
                result.sum ={};
                result.fields.forEach(field => {
                    if (field.type === 'Number'){
                        result.sum[field.name] = 0;
                        result.records.forEach(answer => {
                            if (answer.values[field.name])
                                result.sum[field.name] += answer.values[field.name];
                        });
                    }
                });
                delete result.records;
                log('info' , JSON.stringify(result));
                resolve({body: result , status:200});
            }
            else{
                log('error', `not find form with id= ${id}`);
                reject({body: {message:`not find form with id= ${id}`} , status:404});
            }
        }).catch(err =>{
            log('error' , err);
            reject({body: {message:err} , status:400});
        });
    });
    return await promise;
}

let createForm = async (formJson)=>{
    let promise = new Promise((resolve , reject)=>{
        if (formJson.fields && formJson.fields.length > 0){
            data.createForm(formJson).then(form=>{
                let result = form.toJSON();
                log('info' , JSON.stringify(result));
                delete result.fields;
                delete result.records;
                resolve({body: result , status:200});
            })
            .catch(err=>{
                log('error' , err);
                reject({body: {message:err} , status:422});
            });
        }
        else{
            log('error' , 'Path `fields` is required.');
            reject({body: {message:'Path `fields` is required.'}, status:422});
        }
    });
    return await promise;
}

let getFormAnswers = async (id)=>{
    let promise = new Promise((resolve , reject)=>{
        data.formAnswers(id).then((form=>{
            if(form){
                let result = form.toJSON();
                result.records = result.records.map(answer=>{
                    let values = answer.values;
                    delete answer.values;
                    delete answer.fromId;
                    answer.answerId = answer.id;
                    delete answer.id;
                    answer = {...answer , ...values};
                    return answer; 
                });
                result.sum ={};
                result.fields.forEach(field => {
                    if (field.type === 'Number'){
                        result.sum[field.name] = 0;
                        result.records.forEach(answer => {
                            if (answer[field.name])
                                result.sum[field.name] += answer[field.name];
                        });
                    }
                });
                delete result.fields;
                delete result.answersCount;
                sortJsonArray(result.records , 'createdAt' , 'des');
                log('info' , JSON.stringify(result));
                resolve({body: result , status: 200});
            }
            else{
                log('error' , `no form with id= ${id}`);
                reject({body: {message: `no form with id= ${id}`} , status: 404});
            }
        }))
        .catch(err=>{
            log('error' , err);
            reject({body: {message:err}, status:400});
        });
    });
    return await promise;
}

module.exports = {getForms , getForm , createForm , getFormAnswers};