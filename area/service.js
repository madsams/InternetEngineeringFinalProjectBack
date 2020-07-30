/**
 * This module connect api module to database
 * @module area/service
 */

const data = require('./data');
const log = require('./../logger/logger');
const geometry = require('./../geometry/polygon');
const Point = require('../geometry/point');
const {getFromCache, setInCache} = require('./../cache/redis');

/**
 * Find all areas and serve them for api response
 *
 * @async
 * @function getAreas
 * @return {Promise} The Areas list
 */
let getAreas = async () => {
	let promise = new Promise((resolve, reject) => {
		data.getAreas()
			.then((areas) => {
				if (areas) {
					let result = areas.map((area) => {
						let res = area.toJSON();
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
 * Create new Area and serve response of api
 *
 * @async
 * @function addArea
 * @return {Promise} The Area Json
 */

let addArea = async (polygon) => {
	let promise = new Promise((resolve, reject) => {
		if (geometry.isPolygon(polygon.geometry) === true) {
			data.addArea(polygon)
				.then((area) => {
					let res = area.toJSON();
					let result = {name: res.name, id: res.id};
					log('info', JSON.stringify(res));
					resolve({body: result, status: 200});
				})
				.catch((err) => {
					log('error', err);
					reject({body: {message: err}, status: 422});
				});
		} else {
			reject({body: {message: 'validation error'}, status: 422});
		}
	});
	return await promise;
};

/**
 * Find all covered areas of the point in params and serve them for api response
 *
 * @async
 * @function getAreas
 * @param {object} point - the point [lng , lat]
 * @return {Promise} The Areas list
 */
let getCoveredAreas = async (point) => {
	let promise = new Promise((resolve, reject) => {
		getFromCache(point.toString())
			.then((dataArea) => {
				if (dataArea) {
					resolve({status: 200, body: JSON.parse(dataArea)});
				} else {
					data.getAreas()
						.then((areas) => {
							if (areas) {
								let result = [];
								areas.forEach((area) => {
									let res = area.toJSON();
									let BreakException = {};
									try {
										area.geometry.coordinates.forEach(
											(coordinates) => {
												if (
													Point.isInsidePolygon(
														point,
														coordinates
													) === true
												) {
													result.push({
														name: res.name,
														id: res.id,
													});
													throw BreakException;
												}
											}
										);
									} catch (e) {}
								});
								log('info', JSON.stringify(result));
								setInCache(point.toString(), result);
								resolve({body: result, status: 200});
							} else {
								log('error', 'query failed');
								reject({
									body: {message: 'query failed'},
									status: 500,
								});
							}
						})
						.catch((err) => {
							log('error', err);
							reject({body: {message: err}, status: 400});
						});
				}
			})
			.catch((err) => {
				reject({status: 500, body: {message: err}});
			});
	});
	return await promise;
};

module.exports = {addArea, getAreas, getCoveredAreas};
