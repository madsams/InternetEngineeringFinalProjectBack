const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const polygonSchema = new mongoose.Schema({
	type: {
		type: String,
		enum: ['Polygon'],
		required: true,
	},
	coordinates: {
		type: [[[Number]]],
		required: true,
	},
});

const areaSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		geometry: {
			type: polygonSchema,
			required: true,
		},
		type: {
			type: String,
			enum: ['Feature'],
			required: true,
		},
	},
	{
		toJSON: {
			transform: function (doc, ret) {
				ret.id = ret._id;
				delete ret.geometry._id;
				delete ret._id;
				delete ret.__v;
			},
		},
	}
);

module.exports = mongoose.model('Area', areaSchema);
