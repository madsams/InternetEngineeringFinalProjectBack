
let request = require("request");
let axios = require("axios");
let roles = [];
const log = require('../logger/logger');
const defaultRoles = require('./defaultRoles');
const {redis_client, checkCache} = require('./../cache/redis');


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

getUserRolesFromCache = async (user_sub) => {
    let promise = new Promise((resolve , reject) => {
          redis_client.get(user_sub, (err, data) => {
          if (err) {
              log('error' , err);
              reject(err);
              return;
          }
          //if no match found
          if (data) {
              log('info', 'Read from cache');
              resolve(JSON.parse(data));
              return;
          } else {
              getUserRoles(user_sub).then((result) =>{
                  redis_client.setex(user_sub, 3600, JSON.stringify(result.data));
                  resolve(result.body);
              }).catch((err)=> {
                  console.log(err);
                  reject(err);
              });
          }
        });
    });

    return await promise;
};


module.exports = {getUserRoles, getUserRolesFromCache};
