let axios = require("axios");
const log = require('../logger/logger');
const {getFromCache, setInCache} = require('./../cache/redis');


let apiManagementHeaders = {
  headers: {
    Authorization: `Bearer ${process.env.AUTH0_MGMT_API_ACCESS_TOKEN}`
  }
};

let getUserRoles = async (user_sub)=>{
    let promise = new Promise((resolve , reject)=>{
        axios.get(`https://ieng-final-project.eu.auth0.com/api/v2/users/${user_sub}/roles`, apiManagementHeaders).then(res=>{
            resolve(res);
        }).catch(err=>{
            reject(err);
        });
    });
    return await promise;
}

let getUserRolesFromCache = async (user_sub) => {
    let promise = new Promise((resolve , reject) => {
        getFromCache(user_sub).then(data=>{
            if (data) {
                log('info', 'Read from cache');
                resolve(JSON.parse(data));
                return;
            } else {
                getUserRoles(user_sub).then((result) =>{
                    setInCache(user_sub , result.data);
                    resolve(result.data);
                }).catch((err)=> {
                    reject(err);
                });
            }
        }).catch(err=>{
            log('error' , err);
            reject(err);
        });
          
    });

    return await promise;
};


module.exports = getUserRolesFromCache;
