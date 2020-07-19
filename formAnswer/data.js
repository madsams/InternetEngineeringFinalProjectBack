const FormAnswer = require('./model');
const Form = require('./../form/model');

let findAllAnswers = async ()=> {
    return await FormAnswer.find().populate({path: 'formId', options: { sort: { 'createdAt': -1}}});
}

let findAnswer = async (id)=> {
    return await FormAnswer.findById(id).populate('formId');
}

let findFormAnswers = async (id) => {
    return await FormAnswer.find()
    .where('formId')
    .equals(id).populate('formId');
}

let createFormAnswer = async (formAnswerJson) => {
    const formAnswer = new FormAnswer(formAnswerJson);
    let promise = new Promise((resolve , reject)=>{
        Form.findById(formAnswerJson.formId).then(res=>{
            if (res){
                let ok = true;
                res.fields.forEach(field => {
                    if (field.required && !formAnswerJson.values[field.name]){
                        ok = false;
                        reject({status:422 , body: {message:"form answer is not complete"}});
                        return;
                    }
                });
                if (ok === true)
                    resolve(formAnswer.save());
            }
            else{
                reject({status:404 , body:{message:`not find form with id = ${formAnswerJson.formId}`}});
            }
        }).catch(err =>{
            reject({status:422 , body:{message:err}});
        });
    });
    return await promise;
}

module.exports = {findAllAnswers , findAnswer , createFormAnswer , findFormAnswers};