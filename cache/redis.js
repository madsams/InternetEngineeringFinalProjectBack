/**
 * This module handle all database queries related to cache wth redis
 * @module cache
 */

const redis = require('redis');
const log = require('./../logger/logger');

const redis_client = redis.createClient(
	process.env.REDIS_PORT,
	process.env.REDIS_HOST
);
redis_client.auth(process.env.REDIS_PASSWORD);
console.log('clear cache');
redis_client.flushall();

/**
 *  serving from cache middleware.
 * @function
 * @inner
 * @param {string} idd - undefined or specific string to make data id in cache
 * @param {callback} middleware - read from cache or called next
 */
let checkCache = (idd) => (req, res, next) => {
	let id = req.params.id || req.user.sub;
	if (idd) id = `${idd}_${id}`;
	console.log(`call for ${id}`);
	redis_client.get(id, (err, data) => {
		if (err) {
			log('error', err);
			res.status(500).json(err);
			return;
		}
		//if no match found
		if (data) {
			log('info', 'Read from cache');
			res.status(200).json(JSON.parse(data));
		} else {
			next();
		}
	});
};

/**
 *  saving in cache.
 * @function
 * @param {string} id - the data id in cache
 * @param {string} data - the data to save in cache
 */
let setInCache = (id, data) => {
	redis_client.setex(id, 3600, JSON.stringify(data));
};

/**
 *  serving from cache.
 * @function
 * @param {string} id - the data id in cache
 * @return {Promise} the data tha read from cache or undefined
 */
let getFromCache = async (id) => {
	let promise = new Promise((resolve, reject) => {
		redis_client.get(id, (err, data) => {
			if (err) {
				reject(err);
				return;
			}
			resolve(data);
		});
	});
	return await promise;
};

let remove = (id)=>{
	redis_client.flushall();
}

module.exports = {setInCache, checkCache, getFromCache , remove};
