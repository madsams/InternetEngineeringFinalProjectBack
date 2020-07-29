const FormAnswer = require('./model');

let findAllAnswers = async (userId) => {
	if (userId)
		return await FormAnswer.find({userId})
			.sort({createdAt: -1})
			.populate('formId');
	else
		return await FormAnswer.find().sort({createdAt: -1}).populate('formId');
};

let findAnswer = async (id) => {
	return await FormAnswer.findById(id).populate('formId');
};

let createFormAnswer = async (formAnswerJson) => {
	const formAnswer = new FormAnswer(formAnswerJson);
	return await formAnswer.save();
};

let deleteFormAnswer = async (id) => {
	return await FormAnswer.findByIdAndRemove(id);
};

let deleteMany = async (listOfId) => {
	FormAnswer.deleteMany(
		{
			_id: {
				$in: listOfId,
			},
		},
		function (err, result) {
			if (err) {
				console.log(err);
			} else {
				console.log(result);
			}
		}
	);
};

module.exports = {
	findAllAnswers,
	findAnswer,
	createFormAnswer,
	deleteFormAnswer,
	deleteMany,
};
