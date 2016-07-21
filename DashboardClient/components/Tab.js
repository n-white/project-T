import React from 'react';

import {Panel, Well, Button} from 'react-bootstrap';
import {Image, PageHeader, small} from 'react-bootstrap';

const Tab = (props) => {
  return (
    <Panel>
      <h3>{props.header}<br/><small>{props.sub}</small></h3>
      <div>{props.info}</div>
    </Panel>
  );
}

export default Tab;


