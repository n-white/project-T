var routes = require('express').Router();
var fs = require('fs');
var api_key = require('../../api_keys.js')
var db = require('../database');


module.exports = {
	
	grabFbook: function(req, res) {

		// Search the database for articles that contain the selected trend
		db.FB_Sentiments.findAll({where: {status_message: {like: '%' + 'Hillary Clinton' + '%'}}}).then(function(data) {
			
			// Declare all the variables we will want to send back to the client side
			var num_likes = 0;
			var num_loves = 0
			var num_wows = 0;
			var num_hahas = 0;
			var num_sads = 0;
			var num_angrys = 0;
			var counter = data.length;

			// Iterate through the data object and tally up all of the respective reactions etc 
			for (var i = 0; i < data.length; i++) {
				num_likes += data[i].dataValues.num_likes;
				num_loves += data[i].dataValues.num_loves;
				num_wows += data[i].dataValues.num_wows;
				num_hahas += data[i].dataValues.num_hahas;
				num_sads += data[i].dataValues.num_sads;
				num_angrys += data[i].dataValues.num_angrys;
			}

			// Average the # of reactions across articles
			num_loves = num_loves / counter;
			num_wows = num_wows / counter;
			num_hahas = num_hahas / counter;
			num_sads = num_sads / counter;
			num_angrys = num_angrys / counter;

			totalReactions = num_wows + num_hahas + num_sads + num_angrys + num_loves

			// Compute how much each reaction accounts for among the total reactions
			num_loves = num_loves	/ totalReactions;
			num_wows = num_wows / totalReactions;
			num_hahas = num_hahas / totalReactions;
			num_sads = num_sads / totalReactions;
			num_angrys = num_angrys / totalReactions;

			var summary = {likes: num_likes, loves: num_loves, wows: num_wows, hahas: num_hahas, sads: num_sads, angrys: num_angrys}
			
			res.send(summary)

		})
	}	

}

