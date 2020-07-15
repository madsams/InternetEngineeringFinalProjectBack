const data = require('./data');
const log = require('./../logger/logger');


let findAllAnswers = async ()=>{
    let promise = new Promise((resolve , reject)=>{
        data.findAllAnswers()
        .then(result=>{
            if(result){
                let answers = result.map(answer=>{
                    return answer.toJSON();
                });
                log('info' , JSON.stringify(answers));
                resolve({data:answers , message:'ok'});
            }
            else{
                log('error' , 'query failed');
                reject({data:null,message:'query failed'});
            }
        })
        .catch(err =>{
            log('error' , err);
            reject({data:null , message:err});
        });
    });
    return await promise;
}

let findAnswer = async (id) =>{
    let promise = new Promise((resolve , reject)=>{
        data.findAnswer(id)
        .then(answer=>{
            if(answer){
                log('info' , JSON.stringify(answer));
                resolve({data:answer , message:'ok'});
            }
            else{
                log('error', `not find answer with id= ${id}`);
                reject({data:null,message:`not find answer with id= ${id}`});
            }
        })
        .catch(err =>{
            log('error' , err);
            reject({data:null , message:err});
        });
    });
    return await promise;
}

let findFormAnswers = async (id) => {
    let promise = new Promise((resolve , reject)=>{
        data.findFormAnswers(id)
        .then(result=>{
            if (result){
                let answers = result.map(answer=>{
                    return answer.toJSON();
                });
                log('info' , JSON.stringify(answers));
                resolve({data:answers , message:'ok'});
            }
            else{
                log('error' , `no form with id= ${id}`);
                reject({data:null , message: `no form with id= ${id}`});
            } 
        })
        .catch(err=>{
            log('error' , err);
            reject({data:null , message:err});
        });
    });
    return await promise;
}

let createFormAnswer = async (formAnswerJson) =>{
    let promise = new Promise((resolve , reject)=>{
        data.createFormAnswer(formAnswerJson)
        .then(result=>{
            log('info' , JSON.stringify(result.toJSON()));
            resolve({data:result.toJSON() , message:'ok'});
        })
        .catch(err => {
            log('error' , err);
            reject({data:null , message:err});
        });
    });
    return await promise;
}

module.exports = {findAllAnswers , findAnswer , findFormAnswers , createFormAnswer};
