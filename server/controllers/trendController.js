var googleTrends = require('google-trends-api');
var Promise = require('bluebird');


module.exports = {
	getTrends: function(req, res, next) {
		// Return the hot trends in the US
		var trendArray = 
		googleTrends.hotTrends('US')
		.then(function(results){
			res.send(results);
		})
		.catch(function(err){
			console.log(err);
		})
	}
}