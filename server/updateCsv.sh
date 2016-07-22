#!/bin/sh
stepone="use trendwave;"
steptwo="truncate table FB_Sentiments;"
loadone="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/csv/nytimes_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"

mysql -u root -pcake << eof
$stepone
$steptwo
$loadone
eof