import React from 'react';
import Pie from './Pie';
import Tab from './Tab';
import Navigation from './Navigation';
import {Grid, Row, Col, Clearfix, Panel, Well, Button} from 'react-bootstrap';
import {Navbar, Nav, NavItem, NavDropdown, MenuItem, Image, Jumbotron} from 'react-bootstrap';
import {Router, Route, Link, hashHistory, IndexRoute} from 'react-router';



class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      trends: ['a', 'b', 'c'],
      currentTrend: '',
      data:[
        {age: '5', population: 2704659},
        {age: '5-13', population: 4499890},
        {age: '14-17', population: 2159981},
        {age: '18-24', population: 3853788},
        {age: '25-44', population: 8106543}
      ],
      publicSentiment: '',
      emotionalFeedback: '',
      trendHistory: '',
      representativeTweet: '',
      representativeNewsSource: ''
    }
  }

  fetchData () {
    var context = this;
    $.ajax({
      method:'GET',
      url:'http://localhost:3000/trends',
      contentType: "application/json",
    })
    .done(function(data){
      context.setState({
        data: data.data,
        publicSentiment: data.publicSentiment,
        emotionalFeedback: '',
        trendHistory: '',
        representativeTweet: '',
        representativeNewsSource: ''
      })
      console.log(this.state);
    });
  }


  render () {
    return (
      <Grid>
      <Well>
        <Row>
          <Navigation trends={this.state.trends} currentTrend={this.state.currentTrend} />
        </Row>
        <Row>
          <Col xs={6} md={4}><Tab info={this.state.publicSentiment} header="Public Sentiment" sub="(Twitter Sentiment)"/></Col>
          <Col xs={6} md={4}><Tab info={this.state.emotionalFeedback} header="Emotional Feedback" sub="(Facebook Reactions)"/></Col>
          <Col xsHidden md={4}><Tab info={this.state.trendHistory} header="Trend History" sub="(Need to figure out this data)"/></Col>
        </Row>
        <Row>
          <Col md={6} mdPush={6}>
            <Row>  
              <Tab info={this.state.trendHistory} header="Representative Tweet" sub="(Need to figure out this data)" />
            </Row>
            <Row>
              <Tab info={this.state.trendHistory} header="Representative News Source" sub="(Need to figure out this data)" />
            </Row>
          </Col>
          <Col md={6} mdPull={6}>
            <Pie data={this.state.data}/>
            <Button bsStyle="primary" bsSize="large" onClick={this.fetchData.bind(this)} block>Update Chart  </Button>
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