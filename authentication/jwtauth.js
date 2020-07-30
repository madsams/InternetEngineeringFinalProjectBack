/**
 * This module create jwt for check authentication
 * @module authentication
 */

const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

/** export jwt */
module.exports = jwt({
	secret: jwksRsa.expressJwtSecret({
		cache: true,
		rateLimit: true,
		jwksRequestsPerMinute: 60,
		jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
	}),

	// Validate the audience and the issuer.
	audience: process.env.AUTH0_CLIENT_ID,
	issuer: `https://${process.env.AUTH0_DOMAIN}/`,
	algorithms: ['RS256'],
});
