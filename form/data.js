const Form = require('./model');

let forms = async ()=>{
    return await Form.find().sort({createdAt: -1});
}

let form = async (id) =>{
    return await Form.findById(id);
}

let createForm = async (formJson)=>{
    const form = new Form(formJson);
    return await form.save();
}

let formAnswers = async (id)=>{
    return await Form.findById(id).populate('records');
}

let deleteForm = async (id)=>{
    return await Form.findByIdAndRemove(id);
}

let update = async (formId , answerId)=>{
    return await Form.findByIdAndUpdate(
        formId, { $pull: { "records": answerId}}, { safe: true, upsert: true }
    );
}

module.exports = {forms , form , createForm , formAnswers , deleteForm , update};