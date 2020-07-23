
const express = require('express');
const redis = require('redis');
const log = require('./../logger/logger');

redis_port = process.env.REDIS_PORT;
redis_host = process.env.REDIS_HOST;

const redis_client = redis.createClient(redis_port);

checkCache = (req, res, next) => {
	const {id} = req.params;

	redis_client.get(id, (err, data) => {
    if (err) {
        log(err);
        res.status(500).json(err);
    }
    //if no match found
    if (data != null) {
    	log('Read from cache');
        res.status(200).send(data);
    } else {
      	next();
    }
  });
};

checkUserCache = (req, res, next) => {
    const {id} = req.user.sub;

    redis_client.get(id, (err, data) => {
    if (err) {
        log(err);
        res.status(500).json(err);
    }
    //if no match found
    if (data != null) {
        log('Read from cache');
        res.status(200).send(data);
    } else {
        next();
    }
  });
};

module.exports = {redis_client, checkCache, checkUserCache};