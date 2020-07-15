const FormAnswer = require('./model');
const Form = require('./../form/model');

let findAllAnswer = async ()=> {
    return await FormAnswer.find();
}

let findAnswer = async (id)=> {
    return await FormAnswer.findById(id);
}

let findFormAnswer = async (id) => {
    return await FormAnswer.find()
    .where('formId')
    .equals(id);
}

let createFormAnswer = async (formAnswerJson) => {
    const formAnswer = new FormAnswer(formAnswerJson);
    let promise = new Promise((resolve , reject)=>{
        Form.findById(formAnswerJson.formId).then(res=>{
            if (res){
                console.log('okkkkkkkkkkkkkkk');
                resolve('ok');
            }
            else{
                reject(`not find form with id = ${formAnswerJson.formID}`);
            }
        }).catch(err =>{
            reject(err);
        });
    });
    let result = await promise;
    console.log(result);
    if (result === 'ok'){
        console.log('kheili ok');
        return await formAnswer.save();
    }
    else{
        log('error' , result);
        return null;
    }
}

module.exports = {findAllAnswer , findAnswer , createFormAnswer , findFormAnswer};