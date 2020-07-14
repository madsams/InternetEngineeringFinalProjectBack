let MongoClient = require('mongodb').MongoClient;
let state = {
    db: null,
}
const log = require('./logger/logger');


exports.connect = function (url, done) {
    if (state.db) return done()

    MongoClient.connect(url, function (err, db) {
        if (err) return done(err)
        state.db = db.db(process.env['db-nam'])
        done()

        log('connected to database ')

        state.db.createCollection("forms", function (err, res) {
            if (err) throw err
            debug("Collection forms is now in db!")
        });
        state.db.createCollection("users").then(value=>{
            debug("Collection users is now in db!")
        }).catch(err=>{
            if (err) throw err
        });
        state.db.createCollection("polygons",function(err,res){
            if(err) throw err;
            debug("Collection polygons is now in db!")
        })
        state.db.createCollection("form_answers").then((value)=>{
            debug("Collection form_answers is now in db!")
        }).catch((err)=>{
            throw err;
        })
        
    })
}

exports.get = function () {
    return state.db
}

exports.close = function (done) {
    if (state.db) {
        state.db.close(function (err, result) {
            state.db = null
            state.mode = null
            done(err)
        })
    }
}