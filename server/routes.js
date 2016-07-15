var router = require('express').Router();
var trendController = require('./controllers/trendController.js');
var twitterController = require('./controllers/twitterController.js');

router.route('/trends')
	.get(trendController.getTrends)

router.route('/grabTweets')
	.post(twitterController.grabTweets)

module.exports = router;
