import React, { Component } from 'react'
import {
  Grid,
  Dropdown,
  GridColumn,
  Button,
  Icon,
  Input
} from 'semantic-ui-react';

class CustomerFilter extends Component {
  constructor(props) {
    super(props)
    this.state = {
      customersList: [],
      customer: '',
      mobile: ''
    }
  }

  applyFilter = () => {
    const { customer, mobile } = this.state;
    this.props.filterCustomers({ customer, mobile });
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  handleCustomerInfo = (element) => {
    this.state.customersList.push({
      key: element.code,
      value: element.name,
      text: element.name
    });
  }

  componentWillReceiveProps(nextProps) {
    const users = nextProps.users;
    if (users)
      Array.prototype.forEach.call(users, element => {
        this.handleCustomerInfo(element);
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
            Customer Name
            <Dropdown
              placeholder='Customers'
              name="customer"
              selection
              search
              options={this.state.customersList}
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

export default CustomerFilter
