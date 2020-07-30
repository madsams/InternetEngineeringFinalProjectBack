/**
 * This module connect api module to database
 * @module form/service
 */

const data = require('./data');
const log = require('./../logger/logger');
const sortJsonArray = require('sort-json-array');
const {getCoveredAreas} = require('../area/service');
const formAnswerData = require('./../formAnswer/data');
const filteredBy = require('./filter');

/**
 * Find all forms and serve them for api response
 *
 * @async
 * @function getForms
 * @return {Promise} The forms list
 */
let getForms = async () => {
	let promise = new Promise((resolve, reject) => {
		data.forms()
			.then((forms) => {
				if (forms) {
					let result = forms.map((form) => {
						let res = form.toJSON();
						delete res.fields;
						delete res.records;
						return res;
					});
					log('info', JSON.stringify(result));
					resolve({body: result, status: 200});
				} else {
					log('error', 'query failed');
					reject({body: {message: 'query failed'}, status: 500});
				}
			})
			.catch((err) => {
				log('error', err);
				reject({body: {message: err}, status: 400});
			});
	});
	return await promise;
};

/**
 * Find the form and serve them for api response
 *
 * @async
 * @function getForm
 * @param {string} id the form id
 * @return {Promise} The form
 */
let getForm = async (id) => {
	let promise = new Promise((resolve, reject) => {
		data.form(id)
			.then((form) => {
				if (form) {
					let result = form.toJSON();
					delete result.records;
					log('info', JSON.stringify(result));
					resolve({body: result, status: 200});
				} else {
					log('error', `not find form with id= ${id}`);
					reject({
						body: {message: `not find form with id= ${id}`},
						status: 404,
					});
				}
			})
			.catch((err) => {
				log('error', err);
				reject({body: {message: err}, status: 400});
			});
	});
	return await promise;
};

/**
 * Create new Form and serve response of api
 *
 * @async
 * @function createForm
 * @param {JSON} formJson the form json
 * @return {Promise} The Form Json
 */
let createForm = async (formJson) => {
	let promise = new Promise((resolve, reject) => {
		data.createForm(formJson)
			.then((form) => {
				let result = form.toJSON();
				log('info', JSON.stringify(result));
				delete result.fields;
				delete result.records;
				resolve({body: result, status: 200});
			})
			.catch((err) => {
				log('error', err);
				reject({body: {message: err}, status: 422});
			});
	});
	return await promise;
};

/**
 * Find all form answers then filter and serve them for api response
 *
 * @async
 * @function getForm
 * @param {string} id the from id
 * @param {JSON} filter filter parameters
 * @return {Promise} The form
 */
let getFormAnswers = async (id, filter) => {
	let promise = new Promise((resolve, reject) => {
		data.formAnswers(id, filter)
			.then(async (form) => {
				if (form) {
					let result = form.toJSON();
					result.records = result.records.map((answer) => {
						delete answer.formId;
						answer.answerId = answer.id;
						delete answer.id;
						return answer;
					});
					for (const field of result.fields) {
						if (field.type === 'Location') {
							result.records = await Promise.all(
								result.records.map(async (answer) => {
									let value = answer.values[field.name];
									if (!value) {
										answer.values[field.name] = {
											value: null,
											cover: [],
										};
										return answer;
									}
									let point = [
										parseFloat(
											answer.values[field.name].lng
										),
										parseFloat(
											answer.values[field.name].lat
										),
									];
									let res = await getCoveredAreas(point);
									answer.values[field.name] = {
										value: value,
										cover: [],
									};
									if (
										res.status == 200 &&
										res.body.length > 0
									)
										answer.values[field.name].cover =
											res.body;
									return answer;
								})
							);
						}
					}
					delete result.answersCount;
					result.records = filteredBy(result, filter);
					result.sum = {};
					for (const field of result.fields) {
						if (field.type === 'Number') {
							result.sum[field.name] = 0;
							result.records.forEach((answer) => {
								if (answer.values[field.name])
									result.sum[field.name] += parseInt(
										answer.values[field.name]
									);
							});
						}
					}
					sortJsonArray(result.records, 'createdAt', 'des');
					log('info', JSON.stringify(result));
					resolve({body: result, status: 200});
				} else {
					log('error', `no form with id= ${id}`);
					reject({
						body: {message: `no form with id= ${id}`},
						status: 404,
					});
				}
			})
			.catch((err) => {
				log('error', err);
				reject({body: {message: err}, status: 400});
			});
	});
	return await promise;
};

/**
 * Find the form and delete it and delete its answers
 *
 * @async
 * @function deleteForm
 * @param {string} id the from id
 */
let deleteForm = async (id) => {
	let promise = new Promise((resolve, reject) => {
		data.deleteForm(id)
			.then((result) => {
				if (result) {
					formAnswerData.deleteMany(result.records);
					resolve({body: 'delete...', status: 200});
				} else {
					reject({
						body: {message: `no form with id= ${id}`},
						status: 404,
					});
				}
			})
			.catch((err) => {
				log('error', err);
				reject({body: {message: err}, status: 400});
			});
	});
	return await promise;
};

module.exports = {getForms, getForm, createForm, getFormAnswers, deleteForm};
