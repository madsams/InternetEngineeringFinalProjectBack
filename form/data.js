const Form = require('./model');

let forms = async ()=>{
    return await Form.find();
}

let form = async (id) =>{
    return await Form.findById(id);
}

let createForm = async (formJson)=>{
    const form = new Form(formJson);
    return await form.save();
}

module.exports = {forms , form , createForm};