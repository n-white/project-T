var express = require('express');
var routes = require('./routes.js');
var cors = require('cors');
var Twitter = require('twitter');
var fs = require('fs');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cron = require('node-cron');
var exec = require('child_process').exec;


var app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use('/', routes);

app.use(express.static('DashboardClient'));

app.listen(3000, function (req, res) {
	console.log('server is listening on 3000');
});

//////

var task = cron.schedule('* * * * *', function() {
  console.log('Server is still running');
}, false);


var test = cron.schedule('* * * * *', function() {
  console.log('Update CSV running is still running');
  exec(__dirname + '/updateCSV.sh', function(error, stdout, stderr) {
      console.log('stdout: ', stdout);
      console.log('stderr: ', stderr);
      if (error !== null) {
          console.log('exec error: ', error);
      }
  });
}, false);




task.start();
test.start();


