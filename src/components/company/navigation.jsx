import React, { Component } from "react";
import { connect } from "react-redux";
import { signOutUser } from "../../redux/redux-token-auth-config";
import ClickOutHandler from "react-onclickout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faReceipt,
  faDolly,
  faChartPie,
  faSignOutAlt,
  faChartLine
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import SideNav, { NavItem, NavIcon, NavText } from "@trendmicro/react-sidenav";
import NewReciept from "./newReciept";
import SignUp from "../authentication/signUp";
import SignIn from "../authentication/signIn";
import { Container } from "semantic-ui-react";
import Auth from "../authentication/auth";
import Home from "../company/home";
import Inventory from "../inventory/inventory";
import CreateCompany from "../company/createCompany";
import Reports from "../company/reports";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import StockReport from "../report/stockReport";
import NoRouteFound from "../app/404PageNotFound";

const NavHeader = styled.div`
  display: ${props => (props.expanded ? "block" : "none")};
  white-space: nowrap;
  background-color: #db3d44;
  color: #fff;
  > * {
    color: inherit;
    background-color: inherit;
  }
`;

const NavTitle = styled.div`
  font-size: 1.5em;
  line-height: 20px;
  padding: 22px 0;
`;

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  signOut = e => {
    e.preventDefault();
    const { signOutUser } = this.props;
    signOutUser()
      .then(res =>{})
      .catch(err => console.log(err));
  };

  render() {
    let { isSignedIn } = this.props;
    return (
      <ClickOutHandler
        onClickOut={() => {
          this.setState({ expanded: false });
        }}
      >
        <Router>
          <Route
            render={({ location, history }) => (
              <div className="ui-container">
                {isSignedIn && (
                  <SideNav
                    expanded={this.state.expanded}
                    onToggle={expanded => {
                      this.setState({ expanded });
                    }}
                    onSelect={selected => {
                      const to = "/" + selected;
                      if (location.pathname !== to) {
                        history.push(to);
                      }
                    }}
                  >
                    <SideNav.Toggle />
                    <NavHeader expanded={this.state.expanded}>
                      <NavTitle>Devsinc</NavTitle>
                    </NavHeader>
                    <SideNav.Nav>
                      <NavItem eventKey="home">
                        <NavIcon>
                          <FontAwesomeIcon icon={faHome} />
                        </NavIcon>
                        <NavText>Dashboard</NavText>
                      </NavItem>
                      <NavItem eventKey="reciept">
                        <NavIcon>
                          <FontAwesomeIcon icon={faReceipt} />
                        </NavIcon>
                        <NavText>New Invoice</NavText>
                      </NavItem>
                      <NavItem eventKey="inventory">
                        <NavIcon>
                          <FontAwesomeIcon icon={faDolly} />
                        </NavIcon>
                        <NavText>Inventory</NavText>
                      </NavItem>
                      <NavItem eventKey="reports">
                        <NavIcon>
                          <FontAwesomeIcon icon={faChartPie} />
                        </NavIcon>
                        <NavText>Sale Report</NavText>
                      </NavItem>
                      <NavItem eventKey="stock_report">
                        <NavIcon>
                          <FontAwesomeIcon icon={faChartLine} />
                        </NavIcon>
                        <NavText>Stock Report</NavText>
                      </NavItem>
                      <NavItem eventKey="" onClick={this.signOut}>
                        <NavIcon>
                          <FontAwesomeIcon icon={faSignOutAlt} />
                        </NavIcon>
                        <NavText className="nav-text">Sign Out</NavText>
                      </NavItem>
                    </SideNav.Nav>
                  </SideNav>
                )}
                <Container className="marginTop" textAlign="justified">
                  <Switch>
                    <Route
                      path="/home"
                      exact
                      component={isSignedIn ? Home : Auth}
                    />
                    <Route
                      path="/reciept"
                      exact
                      component={isSignedIn ? NewReciept : Auth}
                    />
                    <Route
                      path="/company/create"
                      exact
                      component={isSignedIn ? CreateCompany : Auth}
                    />
                    <Route
                      path="/inventory"
                      exact
                      component={isSignedIn ? Inventory : Auth}
                    />
                    <Route
                      path="/reports"
                      exact
                      component={isSignedIn ? Reports : Auth}
                    />
                    <Route
                      path="/stock_report"
                      exact
                      component={isSignedIn ? StockReport : Auth}
                    />
                    <Route path="/register" component={SignUp} />
                    <Route path="/login" component={SignIn} />
                    <Route
                      path="/"
                      exact
                      component={isSignedIn ? Home : Auth}
                    />
                    <Route component={NoRouteFound}></Route>
                  </Switch>
                </Container>
              </div>
            )}
          />
        </Router>
      </ClickOutHandler>
    );
  }
}

function mapStateToProps(state) {
  const {
    isSignedIn,
    isLoading,
    attributes
  } = state.reduxTokenAuth.currentUser;
  const { isSuperAdmin } = attributes;
  return { isSignedIn, isLoading, isSuperAdmin };
}

export default connect(
  mapStateToProps,
  { signOutUser }
)(Navigation);
