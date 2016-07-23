import urllib2
import json
import datetime
import csv
import time
import datetime
from dateutil.parser import parse as parse_date
import schedule
import time

app_id = "605873279587083"
app_secret = "1e0e1365da5716e80b1eb898b73dd9cb" # DO NOT SHARE WITH ANYONE!
page_id = "cnn"

access_token = app_id + "|" + app_secret

def request_until_succeed(url):
    req = urllib2.Request(url)
    success = False
    while success is False:
        try: 
            response = urllib2.urlopen(req)
            if response.getcode() == 200:
                success = True
        except Exception, e:
            print e
            time.sleep(5)

            print "Error for URL %s: %s" % (url, datetime.datetime.now())
            print "Retrying."

    return response.read()

# Needed to write tricky unicode correctly to csv
def unicode_normalize(text):
    return text.translate({ 0x2018:0x27, 0x2019:0x27, 0x201C:0x22, 0x201D:0x22,
                            0xa0:0x20 }).encode('utf-8')

def getFacebookPageFeedData(page_id, access_token, num_statuses):

    # Construct the URL string; see http://stackoverflow.com/a/37239851 for
    # Reactions parameters
    base = "https://graph.facebook.com/v2.6"
    node = "/%s/posts" % page_id 
    fields = "/?fields=message,link,created_time,type,name,id," + \
            "comments.limit(0).summary(true),shares,reactions" + \
            ".limit(0).summary(true)"
    parameters = "&limit=%s&access_token=%s" % (num_statuses, access_token)
    url = base + node + fields + parameters

    # retrieve data
    data = json.loads(request_until_succeed(url))

    return data

def getReactionsForStatus(status_id, access_token):

    # See http://stackoverflow.com/a/37239851 for Reactions parameters
        # Reactions are only accessable at a single-post endpoint

    base = "https://graph.facebook.com/v2.6"
    node = "/%s" % status_id
    reactions = "/?fields=" \
            "reactions.type(LIKE).limit(0).summary(total_count).as(like)" \
            ",reactions.type(LOVE).limit(0).summary(total_count).as(love)" \
            ",reactions.type(WOW).limit(0).summary(total_count).as(wow)" \
            ",reactions.type(HAHA).limit(0).summary(total_count).as(haha)" \
            ",reactions.type(SAD).limit(0).summary(total_count).as(sad)" \
            ",reactions.type(ANGRY).limit(0).summary(total_count).as(angry)"
    parameters = "&access_token=%s" % access_token
    url = base + node + reactions + parameters

    # retrieve data
    data = json.loads(request_until_succeed(url))

    return data


def processFacebookPageFeedStatus(status, access_token):

    # The status is now a Python dictionary, so for top-level items,
    # we can simply call the key.

    # Additionally, some items may not always exist,
    # so must check for existence first

    status_id = status['id']
    status_message = '' if 'message' not in status.keys() else \
            unicode_normalize(status['message'])
    link_name = '' if 'name' not in status.keys() else \
            unicode_normalize(status['name'])
    status_type = status['type']
    status_link = '' if 'link' not in status.keys() else \
            unicode_normalize(status['link'])

    # Time needs special care since a) it's in UTC and
    # b) it's not easy to use in statistical programs.

    status_published = datetime.datetime.strptime(
            status['created_time'],'%Y-%m-%dT%H:%M:%S+0000')
    status_published = status_published + \
            datetime.timedelta(hours=-5) # EST
    status_published = status_published.strftime(
            '%Y-%m-%d %H:%M:%S') # best time format for spreadsheet programs

    # Nested items require chaining dictionary keys.

    num_reactions = 0 if 'reactions' not in status else \
            status['reactions']['summary']['total_count']
    num_comments = 0 if 'comments' not in status else \
            status['comments']['summary']['total_count']
    num_shares = 0 if 'shares' not in status else status['shares']['count']

    # Counts of each reaction separately; good for sentiment
    # Only check for reactions if past date of implementation:
    # http://newsroom.fb.com/news/2016/02/reactions-now-available-globally/

    reactions = getReactionsForStatus(status_id, access_token) if \
            status_published > '2016-02-24 00:00:00' else {}

    num_likes = 0 if 'like' not in reactions else \
            reactions['like']['summary']['total_count']

    # Special case: Set number of Likes to Number of reactions for pre-reaction
    # statuses

    num_likes = num_reactions if status_published < '2016-02-24 00:00:00' \
            else num_likes

    def get_num_total_reactions(reaction_type, reactions):
        if reaction_type not in reactions:
            return 0
        else:
            return reactions[reaction_type]['summary']['total_count']

    num_loves = get_num_total_reactions('love', reactions)
    num_wows = get_num_total_reactions('wow', reactions)
    num_hahas = get_num_total_reactions('haha', reactions)
    num_sads = get_num_total_reactions('sad', reactions)
    num_angrys = get_num_total_reactions('angry', reactions)

    # Return a tuple of all processed data

    return (status_id, status_message, link_name, status_type, status_link,
            status_published, num_reactions, num_comments, num_shares,
            num_likes, num_loves, num_wows, num_hahas, num_sads, num_angrys)

def scrapeFacebookPageFeedStatus(page_id, access_token):
    with open('%s_facebook_statuses.csv' % page_id, 'wb') as file:
        w = csv.writer(file)
        w.writerow(["status_id", "status_message", "link_name", "status_type",
                    "status_link", "status_published", "num_reactions", 
                    "num_comments", "num_shares", "num_likes", "num_loves", 
                    "num_wows", "num_hahas", "num_sads", "num_angrys"])

        has_next_page = True
        num_processed = 0   # keep a count on how many we've processed
        scrape_starttime = datetime.datetime.now()

        print "Scraping %s Facebook Page: %s\n" % (page_id, scrape_starttime)

        statuses = getFacebookPageFeedData(page_id, access_token, 100)

        while has_next_page:
            for status in statuses['data']:

                # Ensure it is a status with the expected metadata
                if 'reactions' in status:
                    w.writerow(processFacebookPageFeedStatus(status,
                        access_token))
                print status 
                today = datetime.date.today()
                twodays = today + datetime.timedelta(days=-2)
                createdTime = status.get('created_time')
                dt = parse_date(createdTime)
                if dt.date() < twodays:
                    print 'WOAH THIS WORKED'

                print createdTime
                # output progress occasionally to make sure code is not
                # stalling
                num_processed += 1
                if num_processed % 100 == 0:
                    print "%s Statuses Processed: %s" % \
                        (num_processed, datetime.datetime.now())

                if dt.date() < twodays:
                    print 'two days', twodays
                    print 'dt', dt
                    print num_processed
                    return


            # if there is no next page, we're done.

            if 'paging' in statuses.keys():
                statuses = json.loads(request_until_succeed(
                                        statuses['paging']['next']))
            else:
                has_next_page = False


        print "\nDone!\n%s Statuses Processed in %s" % \
                (num_processed, datetime.datetime.now() - scrape_starttime)


if __name__ == '__main__':
    scrapeFacebookPageFeedStatus(page_id, access_token)

cnn = {
     "page_id": "cnn",
     "access_token": access_token,
}

nytimes = {
     "page_id": "nytimes",
     "access_token": access_token,
}

huffingtonpost = {
     "page_id": "huffingtonpost",
     "access_token": access_token,
}

NPR = {
     "page_id": "NPR",
     "access_token": access_token,
}

USAT = {
     "page_id": "usatoday",
     "access_token": access_token,
}

times = {
     "page_id": "time",
     "access_token": access_token,
}

yahoonews = {
     "page_id": "yahoonews",
     "access_token": access_token,
}

foxnews = {
     "page_id": "FoxNews",
     "access_token": access_token,
}

bbc = {
     "page_id": "bbcnews",
     "access_token": access_token,
}

wsj = {
     "page_id": "wsj",
     "access_token": access_token,
}

tmz = {
     "page_id": "TMZ",
     "access_token": access_token,
}

et = {
     "page_id": "EntertainmentTonight",
     "access_token": access_token,
}

eonline = {
     "page_id": "enews",
     "access_token": access_token,
}

usweekly = {
     "page_id": "UsWeekly",
     "access_token": access_token,
}

popsci = {
     "page_id": "PopSci",
     "access_token": access_token,
}



abc = {
     "page_id": "ABCNews",
     "access_token": access_token,   
}

nbc = {
     "page_id": "NBCNews",
     "access_token": access_token,   
}

washpost = {
     "page_id": "washingtonpost",
     "access_token": access_token,   
}

guardian = {
     "page_id": "theguardian",
     "access_token": access_token,   
}

popsugar = {
     "page_id": "PopSugar",
     "access_token": access_token,   
}

entonight = {
     "page_id": "EntertainmentTonight",
     "access_token": access_token,   
}

intouch = {
     "page_id": "InTouchWeekly",
     "access_token": access_token,  
} 

enweekly = {
     "page_id": "entertainmentweekly",
     "access_token": access_token,   
}

cosmopolitan = {
     "page_id": "Cosmopolitan",
     "access_token": access_token,   
}

people = {
     "page_id": "peoplemag",
     "access_token": access_token,   
}

buzzfeed = {
     "page_id": "BuzzFeed",
     "access_token": access_token,   
}

gawker = {
     "page_id": "Gawker",
     "access_token": access_token,   
}

esquire = {
     "page_id": "Esquire",
     "access_token": access_token,   
}






schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **cnn)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **nytimes)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **huffingtonpost)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **NPR)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **USAT)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **times)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **yahoonews)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **foxnews)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **bbc)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **wsj)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **tmz)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **et)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **eonline)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **usweekly)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **popsci)
# new ones start here
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **esquire)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **abc)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **nbc)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **washpost)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **guardian)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **popsugar)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **entonight)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **intouch)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **enweekly)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **cosmopolitan)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **people)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **buzzfeed)
schedule.every(1).minutes.do(scrapeFacebookPageFeedStatus, **gawker)



while True:
    schedule.run_pending()
    time.sleep(1)


# The CSV can be opened in all major statistical programs. Have fun! :)
