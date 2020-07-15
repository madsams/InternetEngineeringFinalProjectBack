const data = require('./data');
const log = require('./../logger/logger');

let getForms = async () =>{
    let promise = new Promise((resolve , reject)=>{
        data.forms().then(forms=>{
            if (forms){
                let result = forms.map(form => {
                    let res = form.toJSON();
                    const id = res._id;
                    delete res._id;
                    delete res.__v;
                    res['id'] = id;
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
            reject({data:null , message:err});
        });
    });
    let result = await promise;
    return result;
};

let getForm = async (id) =>{
    let promise = new Promise((resolve , reject)=>{
        data.form(id).then(form=>{
            if (form){
                let result = form.toJSON();
                const id = result._id;
                delete result._id;
                delete result.__v;
                result['id'] = id;
                log('info' , JSON.stringify(result));
                resolve({data:result , message:'ok'});
            }
            else{
                log('error', `not find form with id= ${id}`);
                reject({data:null,message:`not find form with id= ${id}`});
            }
        }).catch(err =>{
            reject({data:null , message:err});
        });
    });
    let result = await promise;
    return result;
}

let createForm = async (formJson)=>{
    let promise = new Promise((resolve , reject)=>{
        data.creatForm(formJson).then(form=>{
            let result = form.toJSON();
            const id = result._id;
            delete result._id;
            delete result.__v;
            result['id'] = id;
            log('info' , JSON.stringify(result));
            resolve({data:result , message:'ok'});
        })
        .catch(err=>{
            reject({data:null , message:'Bad Request (request method error)'});
        });
    });
}

module.exports = {getForms , getForm , createForm};