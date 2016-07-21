var routes = require('express').Router();
var googleTrends = require('google-trends-api');
var Twitter = require('twitter');
var fs = require('fs');
var api_key = require('../../api_keys.js')
var db = require('../database');

// Watson functions below

var watson = require('watson-developer-cloud');
var Promise = require('bluebird');

var alchemy_language = watson.alchemy_language({
  api_key: api_key.watson_api_key
});

var getSentiment = function(params) {
	return new Promise(function(resolve, reject) {
		alchemy_language.sentiment(params, function (err, response) {
		  if (err) {
		    reject(err);
		  } else {
		  	resolve(response.docSentiment);
		  }
		});
	})
};

var tweetText = ''

// Twitter functions below

module.exports = {
	
	grabTweets: function(req, res) {
		var query = req.body.q;
		var grabTweets = new Twitter({

		 consumer_key: api_key.consumer_key,
		 consumer_secret: api_key.consumer_secret,
		 access_token_key: api_key.access_token_key,
		 access_token_secret: api_key.access_token_secret

		});

		var max_id = 100000000000000000000000000000000000000;
		var tweetString = '';
		var counter = 0;

		var callTwitter = function() {
			return new Promise(function(resolve, reject) {	
				grabTweets.get('search/tweets', {q: query, count: 100, result_type: 'recent', lang: 'en', result_type: 'recent', max_id: max_id}, function(error, tweets) {
				  if (error) {
				 		reject(err) 
				  } else {

				  	var newMaxId = [];

				  	// find the new max_id
				  	for (var i = 0; i < tweets.statuses.length; i++) {
				  		newMaxId.push(tweets.statuses[i].id)
				  	}

				  	// overwrite the max_id with the new number
				  	newMaxId.sort()
				  	max_id = newMaxId[0] - 10;

				  	// build up the tweetString variable 
				  	resolve(
					   	tweets.statuses.forEach(function(tweetObj, index) {
					   		counter++
					      tweetString += tweetObj.text
					      .replace(/(?:https?|ftp):\/\/[\n\S]+/g, '')
					      .replace(/[`❤️~@#$%^&*()_|☆+\-=;:<>\{\}\[\]\\\/]/gi, ' ')
					      
					    })
				    )
				  }
				})
			})		
		}


		callTwitter().then(function() {
			callTwitter().then(function() {
				callTwitter().then(function() {
					callTwitter().then(function() {
						callTwitter().then(function() {

							getSentiment({text: tweetString}).then(function(data) {
								console.log(data)
								res.send(data);
							});
							
						});
					});
				});
			});
		});

	},

	grabSentiment: function(req, res) {

		var query = req.body.q;
		var grabTweets = new Twitter({

		 consumer_key: api_key.consumer_key,
		 consumer_secret: api_key.consumer_secret,
		 access_token_key: api_key.access_token_key,
		 access_token_secret: api_key.access_token_secret

		});

		grabTweets.get('search/tweets', {q: query, count: 2, result_type: 'popular', lang: 'en', result_type: 'recent'}, function(error, tweets) {
			if (error) {
				throw error
			} else {
				console.log(tweets.statuses[0].text)
			}
		});		
	}

}

