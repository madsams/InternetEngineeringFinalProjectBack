/**
 * This module handle all functions related to polygon.
 * @module geometry/polygon
 */
const geoValid = require('geojson-validation');
const log = require('./../logger/logger');

/**
 *  check is data a polygon or not
 * @function
 * @param {JSON} data - polygon geo Json
 * @return {Boolean} is or not
 */
const isPolygon = function (data) {
	if (geoValid.isPolygon(data)) {
		return true;
	}
	log('error', 'polygon validation error');
	return false;
};

module.exports = {isPolygon};
