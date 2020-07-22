const data = require('./data');
const log = require('./../logger/logger');
const formData = require('./../form/data');
const {getCoveredAreas} = require('./../area/service');

let findAllAnswers = async ()=>{
    let promise = new Promise((resolve , reject)=>{
        data.findAllAnswers()
        .then(result=>{
            if(result){
                let answers = result.map(answer=>{
                    return {id:answer._id , formId: answer.formId._id , createdAt: answer.createdAt , title: answer.formId.title };
                });
                log('info' , JSON.stringify(answers));
                resolve({body: answers , status: 200});
            }
            else{
                log('error' , 'query failed');
                reject({body: {message:'query failed'} , status:500});
            }
        })
        .catch(err =>{
            log('error' , err);
            reject({body: {message:err} , status:400});
        });
    });
    return await promise;
}

let findAnswer = async (id) =>{
    let promise = new Promise((resolve , reject)=>{
        data.findAnswer(id)
        .then(async (answer)=>{
            if(answer){
                let form = {...answer.formId.toJSON()};
                form.formId = form.id;
                delete form.id;
                delete form.records;
                delete form.answersCount;
                form.fields = await Promise.all(form.fields.map(async (field) =>{
                    if (field.type !== 'Location' || !answer.values[field.name] || field.options){
                        field['value'] = answer.values[field.name];
                        return field;
                    }
                    let point = [parseFloat(answer.values[field.name].lng) , parseFloat(answer.values[field.name].lat)];
                    let res = await getCoveredAreas(point);
                    if (res.status == 200 && res.body.length > 0)
                        field['value'] = res.body;
                    else
                        field['value'] = answer.values[field.name];
                    return field;
                }));
                answer = answer.toJSON();
                delete answer.values;
                delete answer.formId;
                delete answer.userId;
                answer = {...answer , ...form};
                log('info' , JSON.stringify(answer));
                resolve({body: answer ,status:200});
            }
            else{
                log('error', `not find answer with id= ${id}`);
                reject({body: {message:`not find answer with id= ${id}`} , status: 404});
            }
        })
        .catch(err =>{
            log('error' , err);
            reject({body: {message:err} , status: 400});
        });
    });
    return await promise;
}

let notMatchType = (value , type)=>{
    if (type === 'Number'){
        if(isNaN(value))
            return false;
        return true;
    }
    else if (type === 'Text'){
        return typeof value === 'string' || value instanceof String;
    }
    else if (type === 'Location'){
        return !isNaN(value.lng) && !isNaN(value.lat) && Object.keys(value).length === 2;
    }
    else{
        return true; //todo: set a format for Date
    }
}

let createFormAnswer = async (formAnswerJson) =>{
    let promise = new Promise((resolve , reject)=>{
        Form.findById(formAnswerJson.formId).then(form=>{
            if (form){
                let ok = true;
                form.fields.forEach(field => {
                    if (field.required && !formAnswerJson.values[field.name]){
                        ok = false;
                        log('error' , 'form answer is not complete')
                        reject({status:422 , body: {message:"form answer is not complete"}});
                        return;
                    }
                    if (formAnswerJson.values[field.name] && notMatchType(formAnswerJson.values[field.name] , field.type) === false){
                        ok = false;
                        log('error' , 'wrong type of value')
                        reject({status:422 , body: {message:"wrong type of value"}});
                        return;
                    }
                });
                if (ok === true){
                    data.createFormAnswer(formAnswerJson)
                    .then(result=>{
                        form.records.push(result._id);
                        form.save().then(()=>{
                            log('info' , JSON.stringify(result.toJSON()));
                            resolve({body: {formAnswerId:result.toJSON().id} , status: 200});
                        })
                        .catch(err=>{
                            log('error' , err);
                            reject(({body:{message:err} ,status:500}));
                        });
                    })
                    .catch(err => {
                        log('error' , err.body.message);
                        reject({status:500 , body:{message: err}});
                    });
                }
            }
            else{
                log('error' , `not find form with id = ${formAnswerJson.formId}`);
                reject({status:404 , body:{message:`not find form with id = ${formAnswerJson.formId}`}});
            }
        }).catch(err =>{
            log('error' , err);
            reject({status:422 , body:{message:err}});
        });
        
    });
    return await promise;
}

let deleteFormAnswer = async (id) =>{
    let promise = new Promise((resolve , reject)=>{
        data.deleteFormAnswer(id).then(result=>{
            formData.update(result.formId , result._id);
            if(result){
                resolve({body:'delete...' , status:200});
            }
            else{
                reject({body: {message: `no form answer with id= ${id}`} , status: 404});
            }
        })
        .catch(err=>{
            log('error' , err);
            reject({body: {message:err}, status:400});
        });
    });
    return await promise;
}

module.exports = {findAllAnswers , findAnswer , createFormAnswer , deleteFormAnswer};
