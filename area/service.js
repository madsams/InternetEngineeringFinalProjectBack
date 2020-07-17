const data = require('./data');
const log = require('./../logger/logger');
const geometry = require('./../geometry/polygon');
const Point = require('../geometry/point');

let getAreas = async () =>{
    let promise = new Promise((resolve , reject)=>{
        data.getAreas().then(areas=>{
            if (areas){
                let result = areas.map(area => {
                    let res = area.toJSON();
                    return res;
                });
                log('info' , JSON.stringify(result));
                resolve({data:result , message:'ok'});
            }
            else{
                log('error' , 'query failed');
                reject({data:null,message:'query failed'});
            }
        }).catch(err =>{
            log('error' , err);
            reject({data:null , message:err});
        });
    });
    return await promise;
};

let addArea = async (polygon)=>{
    let promise = new Promise((resolve , reject)=>{
        if (geometry.isPolygon(polygon.geometry) === true ) {
            data.addArea(polygon).then(area=>{
                let res = area.toJSON();
                let result = {name:res.name , id:res.id};
                log('info' , JSON.stringify(res));
                resolve({data:result , message:'ok'});
            })
            .catch(err=>{
                log('error' , err);
                reject({data:null , message:err});
            });
        }
        else{
            reject({data:null , message:'Bad Request'});
        }
    });
    return await promise;
}

let getCoveredAreas = async (point) =>{
    let promise = new Promise((resolve , reject)=>{
        data.getAreas().then(areas=>{
            if (areas){
                let result = []
                areas.forEach(area => {
                    let res = area.toJSON();
                    let BreakException = {};
                    try{
                        area.geometry.coordinates.forEach((coordinates)=>{
                            if(Point.isInsidePolygon(point, coordinates) === true){
                                result.push(res.name);
                                throw BreakException;
                            }
                        });
                    }
                    catch(e){
                        
                    }
                });
                log('info' , JSON.stringify(result));
                resolve({data:result , message:'ok'});
            }
            else{
                log('error' , 'query failed');
                reject({data:null,message:'query failed'});
            }
        }).catch(err =>{
            log('error' , err);
            reject({data:null , message:err});
        });
    });
    return await promise;
}

module.exports = {addArea , getAreas , getCoveredAreas};