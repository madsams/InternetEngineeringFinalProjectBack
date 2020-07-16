const pointInPolygon = require('point-in-polygon');

const isInsidePolygon = function(point , polygon){
	if (pointInPolygon(point, polygon)){
		return true;
	}
	else return false;
};

module.exports = {isInsidePolygon};