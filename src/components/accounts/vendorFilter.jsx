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
      storesList: [],
      vendor: '',
      store: '',
      mobile: ''
    }
  }

  applyFilter = () => {
    const { vendor, store, mobile } = this.state;
    this.props.filterVendors({ vendor, store, mobile });
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

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
            <Input placeholder='Mobile Number' name="mobile" onChange={this.handleChange} />
          </Grid.Column>
          <Grid.Column>
            Vendor Name
            <Dropdown
              placeholder='Vendors'
              name="vendor"
              selection
              search
              options={this.state.vendorsList}
              onChange={this.handleChange}
            />
          </Grid.Column>
          <Grid.Column>
            Store Name
            <Dropdown
              placeholder='Stores'
              name="store"
              selection
              search
              options={this.state.storesList}
              onChange={this.handleChange}
            />
          </Grid.Column>
          <GridColumn>
            <Button className="search-btn" onClick={this.applyFilter}><Icon name='refresh' /> SEARCH </Button>
          </GridColumn>
        </Grid.Row>
      </Grid>
    )
  }
}

export default VendorFilter
