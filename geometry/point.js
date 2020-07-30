/**
 * This module handle all functions related to Point.
 * @module geometry/point
 */
const pointInPolygon = require('point-in-polygon');

/**
 *  check is a point in a polygon or not
 * @function
 * @param {object} point - the point [lng , lat]
 * @param {Array} polygon - polygon coordinates
 * @return {Boolean} is or not
 */
const isInsidePolygon = function (point, polygon) {
	if (pointInPolygon(point, polygon)) {
		return true;
	} else return false;
};

module.exports = {isInsidePolygon};
