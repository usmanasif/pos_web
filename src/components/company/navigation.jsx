import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";
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
        <Link to="/inventory">
          <Menu.Item
            className="nav_menu_item"
            name="Inventory"
            content="Inventory"
          />
        </Link>
        <Link to="/reports">
          <Menu.Item
            className="nav_menu_item"
            name="Reports"
            content="Reports"
          />
        </Link>
        <Link to="/stock_report">
          <Menu.Item
            className="nav_menu_item"
            name="Stock Report"
            content="Stock Report"
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
