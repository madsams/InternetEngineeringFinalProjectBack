/**
 * This module create logger
 * @module logger
 */

const {createLogger, format, transports} = require('winston');
const {combine, timestamp, printf} = format;
const level = 'debug';

/**
 *]create a custom logger
 * @type {object}
 * @const
 */
const logger = createLogger({
	level,
	format: combine(
		timestamp(),
		printf(
			(info) => `new ${info.level} {\n  message: ${info.message}\n  timestamp: ${info.timestamp}\n}\n`
		)
	),
	transports: [
		new transports.Console({eol: '\r\n\r\n'}),
		new transports.File({
			eol: '\r\n\r\n',
			filename: 'logger.log',
		}),
	],
});


/** export log */
module.exports = function log(level, message) {
	logger.log({
		message,
		level,
	});
};
