const Mongo = require('mongodb').MongoClient;
const assert = require('assert');

//
let url = 'mongodb://localhost:27017' || process.env.BOWEN_MONGO;


// Database name
const dbName = 'bowen_users';
const client = new Mongo(url, {useNewUrlParser: true});