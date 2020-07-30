/**
 * This module handle all database queries related to form answers.
 * @module formAnswer/data
 */

const FormAnswer = require('./model');

/**
 * Find all answers from database or answer of a user
 *
 * @async
 * @function findAllAnswers
 * @param {string} userId - user id or undefined
 * @return {Promise} The answers in database(sorted descending by created time)
 */
let findAllAnswers = async (userId) => {
	if (userId)
		return await FormAnswer.find({userId})
			.sort({createdAt: -1})
			.populate('formId');
	else
		return await FormAnswer.find().sort({createdAt: -1}).populate('formId');
};

/**
 * Find a answer from database
 *
 * @async
 * @function findAnswer
 * @param {string} id answer id
 * @return {Promise} The answer in database
 */
let findAnswer = async (id) => {
	return await FormAnswer.findById(id).populate('formId');
};

/**
 * Create a answer in database
 *
 * @async
 * @function createFormAnswer
 * @param {JSON} formJson - The answer json
 * @return {Promise} The answer that save in database
 */
let createFormAnswer = async (formAnswerJson) => {
	const formAnswer = new FormAnswer(formAnswerJson);
	return await formAnswer.save();
};

/**
 * delete a answer from database
 *
 * @async
 * @function deleteFormAnswer
 * @param {string} id answer id
 * @return {Promise} The answer in database
 */
let deleteFormAnswer = async (id) => {
	return await FormAnswer.findByIdAndRemove(id);
};

/**
 * delete all answers in list
 *
 * @async
 * @function deleteMany
 * @param {Array} listOfId the list if answer id
 */
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
