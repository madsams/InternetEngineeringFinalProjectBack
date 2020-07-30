/**
 * This module handle all api related to forms
 * @module form/api
 */

const express = require('express');
const log = require('./../logger/logger');
const service = require('./service');
const {setInCache, checkCache} = require('./../cache/redis');
const permit = require('../security/checkPermission');
const roles = require('./../security/roles');
const router = express.Router();

router.use(function (req, res, next) {
	log('info', `new ${req.method} request on ${req.originalUrl}`);
	if (
		req.method.toString() !== 'POST' &&
		req.method.toString() !== 'GET' &&
		req.method.toString() !== 'DELETE'
	) {
		log('error', `${req.method} is not correct for ${req.originalUrl}`);
		return res
			.status(400)
			.json({message: 'Bad Request (request method error)'});
	}
	next();
});

/**
 * Route serving all forms.
 * @name get/
 * @function
 * @inner
 * @param {string} path - api path
 * @param {callback} middleware - send all forms as response
 */
router.get('/', (req, res) => {
	let resultPromise = service.getForms();
	resultPromise
		.then((result) => {
			return res.status(result.status).json(result.body);
		})
		.catch((err) => {
			return res.status(err.status).json(err.body);
		});
});

/**
 * Route create a new form
 * @name post/
 * @function
 * @inner
 * @param {string} path - api path
 * @param {callback} permit - check roles can access
 * @param {callback} middleware - create a new form and send it as response
 */
router.post('/', permit(roles.ADMIN), (req, res) => {
	const form = req.body;
	form.createdAt = new Date();
	let resultPromise = service.createForm(form);
	resultPromise
		.then((result) => {
			return res.status(result.status).json(result.body);
		})
		.catch((err) => {
			return res.status(err.status).json(err.body);
		});
});

/**
 * Route serving all answers of the form.
 * @name get/:id/form-answers
 * @function
 * @inner
 * @param {string} path - api path
 * @param {callback} permit - check roles can access
 * @param {callback} middleware - send all forms as response
 */
router.get(
	'/:id/form-answers',
	permit(roles.ADMIN, roles.CONTROL_CENTER_AGENT),
	(req, res) => {
		const id = req.params.id;
		let filter;
		try {
			if (req.query.filter) filter = JSON.parse(req.query.filter);
		} catch (err) {
			return res.status(422).json({message: 'filter is not json'});
		}
		let resultPromise = service.getFormAnswers(id, filter);
		resultPromise
			.then((result) => {
				return res.status(result.status).json(result.body);
			})
			.catch((err) => {
				return res.status(err.status).json(err.body);
			});
	}
);

/**
 * Route serving a form.
 * @name get/:id/
 * @function
 * @inner
 * @param {string} path - api path
 * @param {callback} permit - check roles can access
 * @param {callback} checkCache - first check the cache
 * @param {callback} middleware - send the form as response
 */
router.get(
	'/:id',
	permit(roles.ADMIN, roles.FIELD_AGENT),
	checkCache(undefined),
	(req, res) => {
		const id = req.params.id;
		let resultPromise = service.getForm(id);
		resultPromise
			.then((result) => {
				setInCache(id, result.body);
				return res.status(result.status).json(result.body);
			})
			.catch((err) => {
				return res.status(err.status).json(err.body);
			});
	}
);

/**
 * Route deleting a form.
 * @name delete/:id/
 * @function
 * @inner
 * @param {string} path - api path
 * @param {callback} permit - check roles can access
 * @param {callback} middleware - delete a form
 */
router.delete('/:id', permit(roles.ADMIN), (req, res) => {
	const id = req.params.id;
	let resultPromise = service.deleteForm(id);
	resultPromise
		.then((result) => {
			return res.status(result.status).json(result.body);
		})
		.catch((err) => {
			return res.status(err.status).json(err.body);
		});
});

module.exports = router;
