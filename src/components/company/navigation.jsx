import React, { Component } from 'react'
import { Menu } from 'semantic-ui-react'
import SignOut from '../authentication/signOut'

class Navigation extends Component {
  state = { activeItem: '' }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
  }

  render() {
    const { activeItem } = this.state

    return (
      <Menu>
        <Menu.Item name='home' href="/home" active={activeItem === 'home'} onClick={this.handleItemClick} />
        <Menu.Item
          name='Create Company'
          href="/company/create"
          active={activeItem === 'Create Company'}
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