var router = require('express').Router();
var trendController = require('./controllers/trendController.js');
var twitterController = require('./controllers/twitterController.js');
var facebookController = require('./controllers/facebookController.js');

router.route('/trends')
	.get(trendController.getTrends)

router.route('/grabTweets')
	.post(twitterController.grabTweets)

router.route('/grabFbook')
	.post(facebookController.grabFbook)

module.exports = router;
