
let request = require("request");
let axios = require("axios");
let roles = [];
const log = require('../logger/logger');
const defaultRoles = require('./defaultRoles');

let AUTH0_MGMT_API_ACCESS_TOKEN = process.env.AUTH0_MGMT_API_ACCESS_TOKEN;

let headers = {
    'content-type': 'application/json',
    authorization: `Bearer ${AUTH0_MGMT_API_ACCESS_TOKEN}`,
    'cache-control': 'no-cache'
}

let getRoles = async ()=>{
    let promise = new Promise((resolve , reject)=>{
        axios.get("https://ieng-final-project.eu.auth0.com/api/v2/roles", headers).then(res=>{
            resolve(res);
        }).catch(err=>{
            resolve(defaultRoles);
        });
    });
    return await promise;
}

module.exports = getRoles;
