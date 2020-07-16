const FormAnswer = require('./model');
const Form = require('./../form/model');

let findAllAnswers = async ()=> {
    return await FormAnswer.find().populate('formId');
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
                resolve(formAnswer.save());
            }
            else{
                reject(`not find form with id = ${formAnswerJson.formId}`);
            }
        }).catch(err =>{
            console.log(err);
            reject(err);
        });
    });
    return await promise;
}

module.exports = {findAllAnswers , findAnswer , createFormAnswer , findFormAnswers};