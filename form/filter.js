/**
 * This module filter a form answers
 * @module filter
 */

const log = require('../logger/logger');

/**
 *  filter answer by filter parameters.
 * @function
 * @param {JSON} form - json of the form
 * @param {JSON} filter - filter parameters
 * @return {Array} the filter list of form records
 */
let filteredBy = (form, filter) => {
	if (!filter) return form.records;
	let result = [];
	for (const answer of form.records) {
		result.push(answer);
		try {
			for (const field of form.fields) {
				if (!filter[field.name] || filter[field.name].length === 0)
					continue;
				if (!answer.values[field.name]) {
					result.pop();
					break;
				}
				if (field.type === 'Number') {
					if (
						parseInt(answer.values[field.name]) <=
							parseInt(filter[field.name].to) &&
						parseInt(answer.values[field.name]) >=
							parseInt(filter[field.name].from)
					)
						continue;
				} else if (field.type === 'Text') {
					let ok = false;
					for (const pat of filter[field.name]) {
						if (answer.values[field.name].includes(pat)) {
							ok = true;
							break;
						}
					}
					if (ok === true) continue;
				} else if (field.type === 'Date') {
					let date = new Date(answer.values[field.name]);
					let from = new Date(filter[field.name].from);
					let to = new Date(filter[field.name].to);
					if (
						parseInt(date.getTime()) <= parseInt(to.getTime()) &&
						parseInt(date.getTime()) >= parseInt(from.getTime())
					)
						continue;
				} else {
					if (answer.values[field.name].cover) {
						let ok = false;
						for (const area of filter[field.name]) {
							for (const loc of answer.values[field.name].cover) {
								if (loc.id === area) {
									ok = true;
									break;
								}
							}
							if (ok === true) break;
						}
						if (ok === true) continue;
					}
				}
				result.pop();
				break;
			}
		} catch (err) {
			log('error', err);
		}
	}
	return result;
};

module.exports = filteredBy;
