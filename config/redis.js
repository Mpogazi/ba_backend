var redis = require('redis');
var session = require('express-session');
const client = redis.createClient();
const RedisStore = require('connect-redis')(session);

var redisStore = new RedisStore({
	host: 'localhost',
	port: 3000,
	client: client,
	ttl: 2 * 3600,
});

module.exports = { redisStore };
