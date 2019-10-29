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
  faChartLine,
  faCalculator
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
import Tooltip from 'react-tooltip-lite';
import Accounts from "../accounts/accounts";
import NewVendor from "../accounts/vendor/newVendor"
import NewTransaction from "../accounts/transaction/newTransaction";
import VendorsInfo from "../accounts/vendor/vendorsInfo";
import CustomersInfo from "../accounts/customer/customerInfo";
import NewCustomer from "../accounts/customer/newcustomer";
import AddProduct from "../accounts/product/addProduct"


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
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  render() {
    let { isSignedIn, role, isSuperAdmin } = this.props;
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
                {isSignedIn &&
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
                    className={this.state.expanded ? "sidebar-width" : null}
                  >
                    <SideNav.Toggle />
                    <NavHeader expanded={this.state.expanded}>
                      <NavTitle>Devsinc</NavTitle>
                    </NavHeader>
                    <SideNav.Nav >
                      <NavItem eventKey="home" on={['hover', 'click']} content='Multiple events can trigger a popup'>
                        <NavIcon>
                          <Tooltip content="Dashboard" direction="right">
                            <FontAwesomeIcon icon={faHome} />
                          </Tooltip>
                        </NavIcon>
                        <NavText>Dashboard</NavText>
                      </NavItem>
                      {role === "read_and_write" &&
                        <NavItem eventKey="reciept">
                          <NavIcon>
                            <Tooltip content="New Invoice" direction="right">
                              <FontAwesomeIcon icon={faReceipt} />
                            </Tooltip>
                          </NavIcon>
                          <NavText>New Invoice</NavText>
                        </NavItem>
                      }
                      <NavItem eventKey="inventory">
                        <NavIcon>
                          <Tooltip content="Inventory" direction="right">
                            <FontAwesomeIcon icon={faDolly} />
                          </Tooltip>
                        </NavIcon>
                        <NavText>Inventory</NavText>
                      </NavItem>
                      <NavItem eventKey="reports">
                        <NavIcon>
                          <Tooltip content="Sale Report" direction="right">
                            <FontAwesomeIcon icon={faChartPie} />
                          </Tooltip>
                        </NavIcon>
                        <NavText>Sale Report</NavText>
                      </NavItem>
                      <NavItem eventKey="stock_report">
                        <NavIcon>
                          <Tooltip content="Stock Report" direction="right">
                            <FontAwesomeIcon icon={faChartLine} />
                          </Tooltip>
                        </NavIcon>
                        <NavText>Stock Report</NavText>
                      </NavItem>
                      <NavItem eventKey="accounts">
                        <NavIcon>
                          <Tooltip content="Accounts" direction="right">
                            <FontAwesomeIcon icon={faCalculator} />
                          </Tooltip>
                        </NavIcon>
                        <NavText>Accounts</NavText>
                      </NavItem>
                      <NavItem eventKey="" onClick={this.signOut}>
                        <NavIcon>
                          <Tooltip content="Sign Out" direction="right">
                            <FontAwesomeIcon icon={faSignOutAlt} />
                          </Tooltip>
                        </NavIcon>
                        <NavText className="nav-text">Sign Out</NavText>
                      </NavItem>
                    </SideNav.Nav>
                  </SideNav>
                }
                <Container className="marginTop" textAlign="justified" className={this.state.expanded ? "dashboardExpanded" : "dashboardNotExpanded"}>
                  <Switch>
                    <Route
                      path="/home"
                      component={isSignedIn ? () => <Home role={role} /> : Auth}
                    />
                    <Route
                      path="/reciept"
                      component={isSignedIn ? (role === "read_and_write" ? NewReciept : () => <Home role={role} />) : Auth}
                    />
                    <Route
                      path="/company/create"
                      component={isSignedIn ? (isSuperAdmin ? CreateCompany : () => <Home role={role} />) : Auth}
                    />
                    <Route
                      path="/inventory"
                      render={isSignedIn ? () => <Inventory role={role} /> : Auth}
                    />
                    <Route
                      path="/reports"
                      render={isSignedIn ? () => <Reports role={role} /> : Auth}
                    />
                    <Route
                      path="/stock_report"
                      component={isSignedIn ? () => <StockReport role={role} /> : Auth}
                    />
                    <Route
                      path="/accounts/vendor/new"
                      component={isSignedIn ? () => <NewVendor /> : Auth}
                    />
                    <Route
                      path="/accounts/transaction/new"
                      component={isSignedIn ? () => <NewTransaction /> : Auth}
                    />
                    <Route
                      path="/accounts/vendor/product/new"
                      component={isSignedIn ? () => <AddProduct /> : Auth}
                    />
                    <Route
                      path="/accounts/customer/product/new"
                      component={isSignedIn ? () => <AddProduct /> : Auth}
                    />
                    <Route
                      path="/accounts/customer/new"
                      component={isSignedIn ? () => <NewCustomer /> : Auth}
                    />
                    <Route
                      path="/accounts/customer/:id"
                      component={isSignedIn ? () => <CustomersInfo /> : Auth}
                    />
                    <Route
                      path="/accounts/vendor/:id"
                      component={isSignedIn ? () => <VendorsInfo /> : Auth}
                    />
                    <Route
                      path="/accounts"
                      component={isSignedIn ? () => <Accounts /> : Auth}
                    />
                    
                    <Route path="/register" component={SignUp} />
                    <Route path="/login" component={SignIn} />
                    <Route
                      path="/"
                      exact
                      component={isSignedIn ? () => <Home role={role} /> : Auth}
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
  const { isSuperAdmin, role } = attributes;
  return { isSignedIn, isLoading, isSuperAdmin, role };
}

export default connect(
  mapStateToProps,
  { signOutUser }
)(Navigation);
