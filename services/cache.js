const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');

const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
	this.useCache = true;
	this.hashKey = JSON.stringify(options.key || ''); 

	return this;//so the function be chainable 
}

mongoose.Query.prototype.exec = async function() {
	// console.log(this.getQuery()); //1/ login  2/ middleware 3/ list of blogs
	if(!this.useCache) {
		console.log('not in cache ');
		return exec.apply(this, arguments);
	}
	console.log('in cache ');
	const key = JSON.stringify(
		Object.assign({}, this.getQuery(), {
			collection: this.mongooseCollection.name
		})
	);
	
	const cacheValue = await client.hget(this.hashKey, key);
	console.log('cache', cacheValue);
	if (cacheValue) {
		//const doc = new this.model(JSON.parse(cacheValue))
		const doc = JSON.parse(cacheValue);
		console.log('already exist');
		return Array.isArray(doc) 
			? doc.map(d => new this.model(d))
			: new this.model(doc);
	}
	console.log('Not found in cache');
	const result = await exec.apply(this, arguments);//mongoose document OR module instances
	
	client.hset(this.hashKey, key, JSON.stringify(result));

	return result;
}

module.exports = {
	clearHash(hashKey) {
		client.del(JSON.stringify(hashKey));
		console.log('deleted');
	}
}