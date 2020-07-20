const FormAnswer = require('./model');

let findAllAnswers = async ()=> {
    return await FormAnswer.find().sort({createdAt: -1}).populate('formId');
}

let findAnswer = async (id)=> {
    return await FormAnswer.findById(id).populate('formId');
}

let findFormAnswers = async (id) => {
    return await FormAnswer.find().sort({createdAt: -1})
    .where('formId')
    .equals(id).populate('formId');
}

let createFormAnswer = async (formAnswerJson) => {
    const formAnswer = new FormAnswer(formAnswerJson);
    return await formAnswer.save();
}

module.exports = {findAllAnswers , findAnswer , createFormAnswer , findFormAnswers};