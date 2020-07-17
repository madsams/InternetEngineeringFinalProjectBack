const data = require('./data');
const log = require('./../logger/logger');
const formService = require('./../form/service');

let findAllAnswers = async ()=>{
    let promise = new Promise((resolve , reject)=>{
        data.findAllAnswers()
        .then(result=>{
            if(result){
                let answers = result.map(answer=>{
                    console.log(answer);
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
        .then(answer=>{
            if(answer){
                let form = {...answer.formId.toJSON()};
                form.formId = form.id;
                delete form.id;
                form.fields = form.fields.map(field=>{
                    field['value'] = answer.values[field.name];
                    return field;
                });
                answer = answer.toJSON();
                delete answer.values;
                delete answer.formId;
                answer = {...answer , ...form};
                log('info' , JSON.stringify(answer));
                resolve({body: answer ,status:200});
            }
            else{
                log('error', `not find answer with id= ${id}`);
                reject({body: {message:`not find answer with id= ${id}`} , status: 400});
            }
        })
        .catch(err =>{
            log('error' , err);
            reject({body: {message:err} , status: 400});
        });
    });
    return await promise;
}

let findFormAnswers = async (id) => {
    let promise = new Promise((resolve , reject)=>{
        data.findFormAnswers(id)
        .then(result=>{
            if (result){
                let answers = result.map(answer=>{
                    console.log(answer);
                    return {id:answer._id , formId: answer.formId._id , createdAt: answer.createdAt , title: answer.formId.title };
                });
                log('info' , JSON.stringify(answers));
                resolve({body: answers , status: 200});
            }
            else{
                log('error' , `no form with id= ${id}`);
                reject({body: {message: `no form with id= ${id}`} , status: 400});
            } 
        })
        .catch(err=>{
            log('error' , err);
            reject({body: {message:err}, status:400});
        });
    });
    return await promise;
}

let createFormAnswer = async (formAnswerJson) =>{
    let promise = new Promise((resolve , reject)=>{
        data.createFormAnswer(formAnswerJson)
        .then(result=>{
            log('info' , JSON.stringify(result.toJSON()));
            resolve({body: {formAnswerId:result.toJSON().id} , status: 201});
        })
        .catch(err => {
            log('error' , err);
            reject({body: {message:err} , status: 422});
        });
    });
    return await promise;
}

module.exports = {findAllAnswers , findAnswer , findFormAnswers , createFormAnswer};
