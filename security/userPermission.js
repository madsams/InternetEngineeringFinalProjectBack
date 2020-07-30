/**
 * This module check user permission
 * @module userPermission
 */
const {getFromCache, setInCache} = require('./../cache/redis');
const service = require('./../formAnswer/service');

/**
 *  check user permission for form answer
 * @function
 * @inner
 * @param {callback} middleware - read answers from cache or called next
 */
let userPermission = (req, res, next) => {
	const id = req.params.id;
	getFromCache(id)
		.then((data) => {
			if (data) {
				let answer = JSON.parse(data);
				if (answer.userId === req.user.sub) {
					return res.status(200).json(answer);
				} else {
					next();
				}
			} else {
				service
					.findAnswer(id)
					.then((answer) => {
						setInCache(id, answer.body);
						if (answer.body.userId === req.user.sub)
							return res.status(answer.status).json(answer.body);
						else {
							console.log('next');
							next();
						}
					})
					.catch((err) => {
						console.log(err);
						return res.status(err.status).json(err.body);
					});
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
};

module.exports = userPermission;
