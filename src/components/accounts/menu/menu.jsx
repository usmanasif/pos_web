import React, { Component } from "react";
import { Menu } from "semantic-ui-react";

class MenuPointing extends Component {
  state = { activeItem: 'vendors' }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
    this.props.menuItem(name);
  }
  render() {
    const { activeItem } = this.state

    return (
      <React.Fragment>
        <Menu color="blue" pointing>
          <Menu.Item
            name='vendors'
            active={activeItem === 'vendors'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='customers'
            active={activeItem === 'customers'}
            onClick={this.handleItemClick}
          />
          <Menu.Item
            name='transactions'
            active={activeItem === 'transactions'}
            onClick={this.handleItemClick}
          />
        </Menu>
      </React.Fragment>
    )
  }
}

export default MenuPointing;