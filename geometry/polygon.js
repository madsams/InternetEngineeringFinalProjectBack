const geoValid = require('geojson-validation');
const log = require('./../logger/logger');

const isGeoJson = function(data){
    if (geoValid.valid(data)){
        return true;
    }
    log('error' , 'geojason validation error');
    return false;
}

const isPolygon = function(data){
    if (geoValid.isPolygon(data)){
        return true;
    }
    log('error' , 'polygon validation error');
    return false;
}

module.exports = {isGeoJson , isPolygon};