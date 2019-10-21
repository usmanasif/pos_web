import React, { Component } from 'react'
import {
  Grid,
  Dropdown,
  GridColumn,
  Button,
  Icon
} from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Filters extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startDate: Date(),
      endDate: Date(),
      vendorsList: [],
      storesList: []
    }
  }

  handleChangeStart = e => {
    this.setState({ startDate: e });
  };

  handleChangeEnd = e => {
    this.setState({ endDate: e });
  };

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
    const {
      startDate,
      endDate,
    } = this.state;

    return (
      <Grid columns={5} centered>
        <Grid.Row>
          <Grid.Column>
            From
            <DatePicker
              className="ui input date_picker_input"
              selected={Date.parse(startDate)}
              selectsStart
              startDate={Date.parse(startDate)}
              endDate={Date.parse(endDate)}
              onChange={this.handleChangeStart}
              isClearable={true}
              dateFormat=" dd MMMM yyyy"
            />
          </Grid.Column>
          <Grid.Column>
            To
            <DatePicker
              className="ui input date_picker_input"
              selected={Date.parse(startDate)}
              selectsStart
              startDate={Date.parse(startDate)}
              endDate={Date.parse(endDate)}
              onChange={this.handleChangeStart}
              isClearable={true}
              dateFormat=" dd MMMM yyyy"
            />
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

export default Filters
