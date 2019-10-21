import React, { Component } from 'react'
import {
  Grid,
  Dropdown,
  GridColumn,
  Button,
  Icon,
  Input
} from 'semantic-ui-react';

class VendorFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      vendorsList: [],
      storesList: []
    }
  }

  handleChange = (e, { value }) => this.setState({ value })

  handleStoreInfo = (element) => {
    this.state.storesList.push({
      key: element.code,
      value: element.store_name,
      text: element.store_name
    });
  }

  handleVendorInfo = (element) => {
    this.state.vendorsList.push({
      key: element.code,
      value: element.name,
      text: element.name
    });
  }

  componentWillReceiveProps(nextProps) {
    const users = nextProps.users;
    if (users)
      Array.prototype.forEach.call(users, element => {
        this.handleVendorInfo(element);
        this.handleStoreInfo(element);
      });
  }

  render() {
    return (
      <Grid columns={5} centered>
        <Grid.Row>
          <Grid.Column>
            Mobile
            <Input placeholder='Mobile Number' />
          </Grid.Column>
          <Grid.Column>
            Vendor Name
            <Dropdown placeholder='Customers' search selection options={this.state.vendorsList} />
          </Grid.Column>
          <Grid.Column>
            Store Name
            <Dropdown placeholder='Stores' search selection options={this.state.storesList} />
          </Grid.Column>
          <GridColumn>
            <Button className="search-btn"><Icon name='refresh' /> SEARCH </Button>
          </GridColumn>
        </Grid.Row>
      </Grid>
    )
  }
}

export default VendorFilter
