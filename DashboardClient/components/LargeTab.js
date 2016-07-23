import React from 'react';

import {Panel, Well, Button} from 'react-bootstrap';
import {Image, PageHeader, small} from 'react-bootstrap';


const LargeTab = (props) => {
  return (
    <Panel >
      <h3>{props.header}<br/><small>{props.sub}</small></h3>
      <h3><small>{props.sub2}</small></h3>
    </Panel>
  );
}

export default LargeTab;


