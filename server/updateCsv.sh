#!/bin/sh
stepone="use trendwave;"
steptwo="truncate table FB_Sentiments;"
load1="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/cnn_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load2="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/huffingtonpost_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load3="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/FoxNews_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load4="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/bbcnews_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load5="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/NPR_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load6="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/EntertainmentTonight_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load7="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/enews_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load8="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/nytimes_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load9="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/PopSci_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load10="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/time_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load11="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/TMZ_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load12="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/usatoday_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load13="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/UsWeekly_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load14="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/wsj_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"
load15="LOAD DATA INFILE '/Users/neilWhite/Desktop/hackReactor/project-T/server/facebookScraper/yahoonews_facebook_statuses.csv' INTO TABLE FB_Sentiments FIELDS TERMINATED BY ','  ENCLOSED BY '\"' IGNORE 1 ROWS;"

mysql --local-infile -u root -pcake << eof
$stepone
$steptwo
$load1
$load2
$load3
$load4
$load5
$load6
$load7
$load8
$load9
$load10
$load11
$load12
$load13
$load15
eof