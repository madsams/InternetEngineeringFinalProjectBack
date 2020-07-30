/**
 * This module handle all database queries related to forms.
 * @module form/data
 */

const Form = require('./model');

/**
 * Find all forms from database
 *
 * @async
 * @function forms
 * @return {Promise} The forms in database(sorted descending by created time)
 */
let forms = async () => {
	return await Form.find().sort({createdAt: -1});
};

/**
 * Find a form from database
 *
 * @async
 * @function form
 * @param {string} id form id
 * @return {Promise} The form in database
 */
let form = async (id) => {
	return await Form.findById(id);
};

/**
 * Create a form in database
 *
 * @async
 * @function createForm
 * @param {JSON} formJson - The form json
 * @return {Promise} The form that save in database
 */
let createForm = async (formJson) => {
	const form = new Form(formJson);
	return await form.save();
};

/**
 * Find all answer of a form from database
 *
 * @async
 * @function formAnswers
 * @param {string} id form id
 * @return {Promise} populated form in database
 */
let formAnswers = async (id) => {
	return await Form.findById(id).populate('records');
};

/**
 * delete a form from database
 *
 * @async
 * @function deleteForm
 * @param {string} id form id
 * @return {Promise} The form in database
 */
let deleteForm = async (id) => {
	return await Form.findByIdAndRemove(id);
};

/**
 * delete a specific answer from a form records.
 *
 * @async
 * @function update
 * @param {string} fromId form id
 * @param {string} answerId answer id
 * @return {Promise} The result of update
 */
let update = async (formId, answerId) => {
	return await Form.findByIdAndUpdate(
		formId,
		{$pull: {records: answerId}},
		{safe: true, upsert: true}
	);
};

module.exports = {forms, form, createForm, formAnswers, deleteForm, update};
