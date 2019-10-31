const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
	await next();//wait the exec of the route handler the delete

	clearHash(req.user.id);
}