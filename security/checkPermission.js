/**
 * This module check permission
 * @module permission
 */
const getUserRoles = require('./../user/roles');

/**
 *  check roles permission
 * @function permit
 * @inner
 * @param {Array} allowed allowed roles to access
 * @param {callback} middleware - check permission ans try to call next
 */
module.exports = function permit(...allowed) {
	return (req, res, next) => {
		getUserRoles(req.user.sub)
			.then((result) => {
				for (const role of result) {
					if (allowed.includes(role.name)) {
						next();
						return;
					}
				}
				res.status(401).json({
					message: `no permission for ${req.originalUrl}`,
				});
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	};
};
