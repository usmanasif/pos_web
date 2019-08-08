import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Segment } from "semantic-ui-react";
import SignOut from "../authentication/signOut";

class Navigation extends Component {

  render() {

    return (
      <Menu>
        <Link to="/home">
          <Menu.Item
            className="nav_menu_item"
            name="Create Invoice"
            content="Create Invoice"
          />
        </Link>
        <Link to="/login">
          <Menu.Item
            className="nav_menu_item"
            name="Inventory"
            content="Inventory"
          />
        </Link>

        <Menu.Menu position="right">
          <Menu.Item name="logout" className="nav_menu_menu_item">
            <SignOut />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

export default Navigation;
