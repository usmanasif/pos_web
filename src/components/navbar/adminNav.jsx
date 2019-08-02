import React, { Component } from "react";
import { Menu, Segment } from "semantic-ui-react";
import SignOut from "../authentication/signOut";
import CreateCompany from "../company/createCompany";

class AdminNav extends Component {
  state = { activeItem: "Create Company" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <div className="m-10">
        <Menu pointing>
          <Menu.Item
            name="Create Company"
            color="green"
            active={activeItem === "Create Company"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="Edit Company"
            color="pink"
            active={activeItem === "Edit Company"}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name="Delete Company"
            color="red"
            active={activeItem === "Delete Company"}
            onClick={this.handleItemClick}
          />
          <Menu.Menu position="right">
            <div className="m-5">
              <SignOut />
            </div>
          </Menu.Menu>
        </Menu>

        {activeItem === "Create Company" && (
          <Segment textAlign="right" color="green">
            <CreateCompany />
          </Segment>
        )}

        {activeItem === "Edit Company" && (
          <Segment textAlign="right" color="pink">
            <h1>Edit Company</h1>
          </Segment>
        )}

        {activeItem === "Delete Company" && (
          <Segment textAlign="right" color="red">
            <h1>Delete Company</h1>
          </Segment>
        )}
      </div>
    );
  }
}

export default AdminNav;
