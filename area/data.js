/**
 * This module handle all database queries related to areas
 * @module area/data
 */

const Area = require('./model');

/**
 * Find all areas from database
 *
 * @async
 * @function getAreas
 * @return {Promise} The Areas in database
 */
let getAreas = async () => {
	return await Area.find();
};
/**
 * Create an Area in database
 *
 * @async
 * @function addArea
 * @param {JSON} polygon - The polygon json for area
 * @return {Promise} The Area that save in database
 */
let addArea = async (polygon) => {
	const area = new Area(polygon);
	return await area.save();
};

module.exports = {getAreas, addArea};
