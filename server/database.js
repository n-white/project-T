var Sequelize = require('Sequelize');
var sequelize = new Sequelize('trendwave', 'root', 'cake');
var mysql = require('mysql');

var Trends = sequelize.define('Trends', {
 name: Sequelize.STRING
});

var Twitter_Sentiments = sequelize.define('Twitter_Sentiments', {
  neutral: Sequelize.DECIMAL,
  positive: Sequelize.DECIMAL,
  negative: Sequelize.DECIMAL
});

var FB_Sentiments = sequelize.define('FB_Sentiments', {
  status_id: Sequelize.STRING,
  status_message: Sequelize.STRING(2000),
  link_name: Sequelize.STRING,
  status_type: Sequelize.STRING,
  status_link: Sequelize.STRING,
  status_published: Sequelize.STRING,
  num_reactions: Sequelize.INTEGER,
  num_comments: Sequelize.INTEGER,
  num_shares: Sequelize.INTEGER,
  num_likes: Sequelize.INTEGER,
  num_loves: Sequelize.INTEGER,
  num_wows: Sequelize.INTEGER,
  num_hahas: Sequelize.INTEGER,
  num_sads: Sequelize.INTEGER,
  num_angrys: Sequelize.INTEGER
}, {
   timestamps: false
});

FB_Sentiments.removeAttribute('id');

// var Trend_Popularity = sequelize.define('Trend_Popularity', {
//   popularity: Sequelize.INTEGER,
//   time: Sequelize.DATE
// });

// Trends.hasMany(Twitter_Sentiments);

// FB_Sentiments.hasMany(Trends);
// Trend_Popularity.hasMany(Trends);

// Twitter_Sentiments.sync().then(Trends.sync().then(FB_Sentiments.sync().then(function() {
// "LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/csv/nytimes_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;"
// })));

// var myquery = JSON.stringify(LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/csv/nytimes_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 ROWS;);

Trends.sync().then(Twitter_Sentiments.sync().then(FB_Sentiments.sync()));

exports.Trends = Trends;
exports.Twitter_Sentiments = Twitter_Sentiments;
exports.FB_Sentiments = FB_Sentiments;

// exports.Trend_Popularity = Trend_Popularity;