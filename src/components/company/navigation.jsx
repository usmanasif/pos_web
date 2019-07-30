import React, { Component } from 'react'
import { Input, Menu } from 'semantic-ui-react'
import SignOut from '../authentication/signOut'

class Navigation extends Component {
  state = { activeItem: 'home' }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu secondary>
        <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} />
        <Menu.Item
          name='Inventory'
          active={activeItem === 'messages'}
          onClick={this.handleItemClick}
        />
        <Menu.Menu position='right'>
          <Menu.Item name='logout'>
            <SignOut></SignOut>  
          </Menu.Item>
          
        </Menu.Menu>
      </Menu>
    )
  }
}

export default Navigation;