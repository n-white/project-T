import React from 'react';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import {Grid, Row, Col, Clearfix, Panel, Well, Button} from 'react-bootstrap';


class App extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      trends: ['a', 'b', 'c'];
      currentTrend: ''
    }
  }
  render() {
    return (
      <Grid>
        <Row>
          <Navigation trends={this.state.trends} currentTrend={this.state.currentTrend} />
        </Row>
      </Grid>
    );
  }
}