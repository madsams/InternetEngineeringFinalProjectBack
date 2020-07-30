/**
 * This module handle all api related to areas
 * @module area/api
 */

const express = require('express');
const log = require('./../logger/logger');
const service = require('./service');
const {check, validationResult} = require('express-validator');
const checks = [check('lng').isFloat(), check('lat').isFloat()];
const permit = require('../security/checkPermission');
const roles = require('./../security/roles');
const router = express.Router();

/**
 * make a format for messages of the errors
 *
 * @function errorFormatter
 * @return {string} the message of the error in a custom format
 */
const errorFormatter = ({location, msg, param}) => {
	return ` ${param} -> ${msg} `;
};

router.use(function (req, res, next) {
	log('info', `new ${req.method} request on ${req.originalUrl}`);
	if (req.method.toString() !== 'POST' && req.method.toString() !== 'GET') {
		log('error', `${req.method} is not correct for ${req.originalUrl}`);
		return res
			.status(400)
			.json({message: 'Bad Request (request method error)'});
	}
	next();
});

/**
 * Route serving covered areas.
 * @name get/testpoint
 * @function
 * @inner
 * @param {string} path - api path
 * @param {callback} permit - check roles can access
 * @param {callback} check - check has valid params in req.params
 * @param {callback} middleware - send all covered areas of the point as response
 */

router.get(
	'/testpoint',
	permit(roles.ADMIN, roles.FIELD_AGENT),
	checks,
	function (req, res) {
		const errors = validationResult(req).formatWith(errorFormatter);
		if (!errors.isEmpty()) {
			log('error', `${errors.array()}`);
			return res
				.status(422)
				.json({message: 'Bad Request (params error)'});
		}
		const point = [req.query.lng, req.query.lat];
		service
			.getCoveredAreas(point)
			.then((result) => {
				return res.status(result.status).json(result.body);
			})
			.catch((err) => {
				return res.status(err.status).json(err.body);
			});
	}
);

/**
 * Route serving all areas.
 * @name get/
 * @function
 * @inner
 * @param {string} path - api path
 * @param {callback} permit - check roles can access
 * @param {callback} middleware - send all areas as response
 */
router.get('/', permit(roles.ADMIN, roles.CONTROL_CENTER_AGENT), (req, res) => {
	service
		.getAreas()
		.then((result) => {
			return res.status(result.status).json(result.body);
		})
		.catch((err) => {
			return res.status(err.status).json(err.body);
		});
});

/**
 * Route create a new area
 * @name post/
 * @function
 * @inner
 * @param {string} path - api path
 * @param {callback} permit - check roles can access
 * @param {callback} middleware - create a new area and send it as response
 */
router.post('/', permit(roles.ADMIN), (req, res) => {
	const area = req.body;
	service
		.addArea(area)
		.then((result) => {
			return res.status(result.status).json(result.body);
		})
		.catch((err) => {
			return res.status(err.status).json(err.body);
		});
});

module.exports = router;
