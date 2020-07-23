const FormAnswer = require('./model');

let findAllAnswers = async (userId)=> {
    if (userId)
        return await FormAnswer.find({userId}).sort({createdAt: -1}).populate('formId');
    else 
        return await FormAnswer.find().sort({createdAt: -1}).populate('formId');
}

let findAnswer = async (id)=> {
    return await FormAnswer.findById(id).populate('formId');
}

let createFormAnswer = async (formAnswerJson) => {
    const formAnswer = new FormAnswer(formAnswerJson);
    return await formAnswer.save();
}

let deleteFormAnswer = async (id) => {
    return await FormAnswer.findByIdAndRemove(id);
}

module.exports = {findAllAnswers , findAnswer , createFormAnswer , deleteFormAnswer};