// import React from 'react';
// import {Router, Route, Link, hashHistory, IndexRoute} from 'react-router';
// import {Navbar, Nav, NavItem, NavDropdown, MenuItem} from 'react-bootstrap';

// class Navigation extends React.Component {
//   constructor (props) {
//     super(props);
//   }
//   render () {
//     return (
//       <Navbar inverse>
//         <Navbar.Header>
//           <Navbar.Brand>
//             <a href="#">Trend Wave</a>
//           </Navbar.Brand>
//         </Navbar.Header>
//         <Nav >
//           <NavDropdown eventKey={1} title="Current Trends" id="basic-nav-dropdown" >
//             <MenuItem eventKey={1.1} >Select Trend</MenuItem>
//             <MenuItem divider />
//             <MenuItem />
//             {
//               this.props.trends.map(function(trend, index) {
//                 var eKey = Number('1.' + (index + 1));
//                 return <MenuItem eventKey={eKey} >{trend}</MenuItem>
//               })
//             }
//           </NavDropdown>
//         </Nav>
//       </Navbar>
//     );
//   }
// }

// export default Navigation;
