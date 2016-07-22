import React from 'react';
import Pie from './Pie';
import Tab from './Tab';

import {Grid, Row, Col, Clearfix, Panel, Well, Button} from 'react-bootstrap';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Image, Jumbotron} from 'react-bootstrap';
import {Router, Route, Link, hashHistory, IndexRoute} from 'react-router';



class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      trends: [],
      currentTrend: 'Select Trend',
      twitterData:[
        {label: 'positive', score: 50},
        {label: 'negative', score: 50},
      ],
      facebookData:[
        {label: 'positive', score: 50},
        {label: 'negative', score: 50},
      ],
      publicSentiment: '',
      emotionalFeedback: '',
      trendHistory: '',
      representativeTweet: '',
      representativeNewsSource: '',
      twitterSpinner: false,
      facebookSpinner: false //not likely to be needed
    }
  }

  componentDidMount () {
    //start everything
    this.getTrends();
    this.updateChart(this.state.twitterData, '#twitterChart');
    this.updateChart(this.state.twitterData, '#facebookChart');

    // setInterval(this.getTrends.bind(this), 3000);
  }

  getTrends () {
    //pull in data from google trends to populate dropdown menu
    var context = this;
    $.get('http://localhost:3000/trends', function(data){
      // console.log('!@#$!@#!@#',context);
      context.setState({
        trends: data
      })
      // console.log(context.state.trends);
    });
  }

  twitterGrab (q) {
    //pull in twitter data from watson to populate twitter chart
    var context = this;
    this.setState({
      currentTrend: q,
      twitterSpinner: true
    })
    // console.log(q, this);
    $.ajax({
      method: "POST",
      url: 'http://localhost:3000/grabTweets',
      data: JSON.stringify({q: q}),
      contentType: "application/json",
      success: function(d){
        console.log('response tweet: ', d);
        context.setState({
          twitterData: map(d, function(value, prop){
            return {
              label: prop,
              score: value
            };
          }),
          twitterSpinner: false
        });
        console.log('New state is: ',context.state.twitterData);
        d3.select('#twitterChart').selectAll('svg').remove();
        context.updateChart(context.state.twitterData, '#twitterChart');
      },
      dataType: 'json'
    });
  }

  facebookGrab (q) {
    //grab facebook data for fb chart
    this.setState({
      currentTrend: q
    })
    var context = this;
    // console.log(q, this);
    $.ajax({
      method: "POST",
      url: 'http://localhost:3000/grabFbook',
      data: JSON.stringify({q: q}),
      contentType: "application/json",
      success: function(d){
        var fbdata = map(d, function(value, prop){
          return { 
            label: prop,
            score: value === null ? 1 : value
          };
        })
        context.setState({
          facebookData: fbdata
        });
        console.log('response fb mapped: ', fbdata);
        d3.select('#facebookChart').selectAll('svg').remove();
        context.updateChart(context.state.facebookData, '#facebookChart');
      },
      dataType: 'json'
    });
  }

  topTweetGrab (q) {
    //grab top tweet data to populate representative tweet panel
    var context = this;
    this.setState({
      currentTrend: q
    })

    // console.log(q, this);
    $.ajax({
      method: "POST",
      url: 'http://localhost:3000/grabTopTweet',
      data: JSON.stringify({q: q}),
      contentType: "application/json",
      success: function(d){
        console.log('response top tweet: ',d);
        context.setState({
          representativeTweet: d
        })
      },
      dataType: 'json'
    });
  }

  allDataGrab (q) {
    //update everything (when new trend is selected)
    this.setState({
      currentTrend: q
    })
    this.topTweetGrab(q);
    this.facebookGrab(q);
    this.twitterGrab(q);
  }

  updateChart (data, id) {
    var width = 450, //960
        height = 450, //500
        radius = Math.min(width, height) / 2;

    //Ordinal scale w/ default domain and colors for range
    var color = d3.scaleOrdinal()
        .range(["#F0AD44","#128085","#FAE8CD","#385052","#C74029"]);



    //create arc data (to define path svg)
    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    var labelArc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0);

    //create pie layout order data
    var pie = d3.pie()
        .sort(null)
        .value(function(d){
          return d.score;
        });
    //append both and svg and a g (group) element to the page. Move it over to the middle
    var svg = d3.select(id).append('svg')
              .attr('width', width)
              .attr('height', height)
              .append('g')
              .attr('transform', 'translate(' + width / 2 + "," + height / 2 + ')');

    //Apply data to pie and add g's on enter
    var g = svg.selectAll('.arc')
            .data(pie(data))
            .enter()
            .append('g')
            .attr('class', 'arc');

    //put a path element in the g, give it a d attribute of the previously defined arc path. Grab its color from the scale range
    g.append('path')
    .attr('d', arc)
    .style('fill', function(d) {return color(d.data.label);});

    //put svg text elements on each g. Use the cenrtroid method to position center of the slice. Shift the dy positioning. Pull text from data
    g.append('text')
    .attr('transform', function(d){return 'translate('+ labelArc.centroid(d) + ')'; })
    .attr('dy', '.35em')
    .attr('dx', '-.8em')
    .attr('font-size', '15px')
    .text(function(d) {return d.data.label;});
  }


  render () {
    return (
      <Grid>
      <Well>
        <Row>
          <Navbar inverse>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">Trend Wave</a>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav >
              <NavDropdown eventKey={1} title="Current Trends" id="basic-nav-dropdown" >
                <MenuItem eventKey={1.1} >Select Trend</MenuItem>
                <MenuItem divider />
                <MenuItem />
                {
                  this.state.trends.map(function(trend, index) {
                    var eKey = Number('1.' + (index + 1));
                    var context = this;
                    var handler = function(){
                      context.allDataGrab(trend);
                    }
                    return <MenuItem eventKey={eKey} key={index} onClick={handler}>{trend}</MenuItem>
                  }.bind(this))
                }
              </NavDropdown>
            </Nav>
          </Navbar>
        </Row>
        <Row>
          <Col xs={6} md={4}><Tab info={this.state.trendHistory} header={this.state.currentTrend} sub="(Need to figure out this data)"/></Col>
          <Col xs={6} md={4}><Tab info={this.state.publicSentiment} header="Public Sentiment" sub="(Twitter Sentiment)"/></Col>
          <Col xs={6} md={4}><Tab info={this.state.emotionalFeedback} header="Emotional Feedback" sub="(Facebook Reactions)"/></Col>
        </Row>
        <Row>
          <Col md={6} mdPush={6}>
            <Row>  
              <Tab info={this.state.trendHistory} header="Representative Tweet" sub={this.state.representativeTweet} />
            </Row>
            <Row>
              <Tab info={this.state.trendHistory} header="Representative News Source" sub="(Need to figure out this data)" />
            </Row>
          </Col>
          <Col md={6} mdPull={6}>
            <h2 >Twitter Sentiment</h2>
            <div id="twitterChart" style={this.state.twitterSpinner ? {backgroundImage: 'url(styles/spiffygif_46x46.gif)', 'background-repeat':'no-repeat'} : {backgroundImage: 'none'}}></div>
            <h2>Facebook Sentiment</h2>
            <div id="facebookChart"></div>
            <Button bsStyle="primary" bsSize="large" onClick={this.allDataGrab.bind(this, this.state.currentTrend)} block>Update Chart  </Button>
          </Col>
        </Row>
        <Row>

        </Row>
        <Row>
          <Jumbotron>

          </Jumbotron>
        </Row>
      </Well>
      </Grid>
    );
  }
}

export default Dashboard;


var map = function(obj, cb){
  var result = [];
  for(var i in obj){
    result.push(cb(obj[i], i, obj));
  }
  return result;
}








