const Area = require('./model');

let getAreas = async () => {
	return await Area.find();
};

let addArea = async (polygon) => {
	const area = new Area(polygon);
	return await area.save();
};

module.exports = {getAreas, addArea};
