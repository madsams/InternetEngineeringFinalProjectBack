let notMatchType = (value, type) => {
	if (type === 'Number') {
		if (isNaN(value)) return false;
		return true;
	} else if (type === 'Text') {
		return typeof value === 'string' || value instanceof String;
	} else if (type === 'Location') {
		return (
			!isNaN(value.lng) &&
			!isNaN(value.lat) &&
			Object.keys(value).length === 2
		);
	} else {
		let d = new Date(value);
		return d instanceof Date && !isNaN(d);
	}
};

module.exports = notMatchType;
