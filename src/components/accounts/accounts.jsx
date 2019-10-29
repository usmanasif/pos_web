import React, { Component } from "react";

import { Container, Header, Image } from "semantic-ui-react";
import { withRouter } from "react-router";
import Vendors from "./vendor/vendors";
import MenuPointing from "./menu/menu";
import Transactions from "./transaction/transactions"
import Customers from "./customer/customers";

class Accounts extends Component {
  state = {
    menuItem: "vendors"
  }

  selectMenu = (item) => {
    this.setState(
      {
        menuItem: item
      }
    );
  }
  
  render() {
    return (
      <React.Fragment>
        <Container className="page-header">
          <Header as="h2" className="second-header" floated="right">
            Devsinc
					</Header>
          <Header as="h2" floated="left">
            <Image className="logo" src={require("../../images/logo.png")} />
            <span className="header-text">Accounts</span>
          </Header>
        </Container>
        <div className="ui divider"></div>
        <MenuPointing menuItem={this.selectMenu}></MenuPointing>
        {
          this.state.menuItem === "vendors" ? <Vendors></Vendors> :
            this.state.menuItem === "transactions" ? <Transactions></Transactions>:
            this.state.menuItem === "customers" ? <Customers></Customers>:null
        }
      </React.Fragment>
    )
  }
}
export default withRouter(Accounts);

