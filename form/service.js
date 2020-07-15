const data = require('./data');
const log = require('./../logger/logger');

let getForms = async () =>{
    let promise = new Promise((resolve , reject)=>{
        data.forms().then(forms=>{
            if (forms){
                let result = forms.map(form => {
                    let res = form.toJSON();
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

let getForm = async (id) =>{
    let promise = new Promise((resolve , reject)=>{
        data.form(id).then(form=>{
            if (form){
                let result = form.toJSON();
                log('info' , JSON.stringify(result));
                resolve({data:result , message:'ok'});
            }
            else{
                log('error', `not find form with id= ${id}`);
                reject({data:null,message:`not find form with id= ${id}`});
            }
        }).catch(err =>{
            log('error' , err);
            reject({data:null , message:err});
        });
    });
    return await promise;
}

let createForm = async (formJson)=>{
    let promise = new Promise((resolve , reject)=>{
        data.createForm(formJson).then(form=>{
            let result = form.toJSON();
            log('info' , JSON.stringify(result));
            resolve({data:result , message:'ok'});
        })
        .catch(err=>{
            log('error' , err);
            reject({data:null , message:err});
        });
    });
    return await promise;
}

module.exports = {getForms , getForm , createForm};