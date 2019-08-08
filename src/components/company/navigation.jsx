import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Menu, Segment } from "semantic-ui-react";
import SignOut from "../authentication/signOut";

class Navigation extends Component {
  state = { activeItem: "Create Invoice" };

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;

    return (
      <Menu>
        <Link to="/home">
          <Menu.Item
            className="nav_menu_item"
            name="Create Invoice"
            content="Create Invoice"
            active={activeItem === "Create Invoice"}
            onClick={this.handleItemClick}
          />
        </Link>
        <Link to="/inventory">
          <Menu.Item
            className="nav_menu_item"
            name="Inventory"
            content="Inventory"
            active={activeItem === "Inventory"}
            onClick={this.handleItemClick}
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
