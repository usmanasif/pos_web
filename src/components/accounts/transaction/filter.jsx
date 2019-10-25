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
      startDate: '',
      endDate: '',
      vendorsList: [],
      storesList: [],
      vendor: '',
      store: '',
    }
  }

  applyFilter = () => {
    const { vendor, store, startDate, endDate } = this.state;
    this.props.filterTransactions({ vendor, store, startDate, endDate });
  }

  handleChangeStart = e => {
    this.setState({ startDate: e });
  };

  handleChangeEnd = e => {
    this.setState({ endDate: e });
  };

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
    const {
      startDate,
      endDate,
    } = this.state;

    return (
      <Grid columns={5} centered>
        <Grid.Row>
          <Grid.Column>
            Date From
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
            Date To
            <DatePicker
              className="ui input date_picker_input"
              selected={Date.parse(endDate)}
              selectsEnd
              startDate={Date.parse(startDate)}
              endDate={Date.parse(endDate)}
              onChange={this.handleChangeEnd}
              minDate={Date.parse(startDate)}
              isClearable={true}
              dateFormat=" dd MMMM yyyy"
            />
          </Grid.Column>
          <Grid.Column>
            Vendor Name
            <Dropdown placeholder='Customers' name="vendor" search selection options={this.state.vendorsList} onChange={this.handleChange} />
          </Grid.Column>
          <Grid.Column>
            Store Name
            <Dropdown placeholder='Stores' name="store" search selection options={this.state.storesList} onChange={this.handleChange} />
          </Grid.Column>
          <GridColumn>
            <Button className="search-btn" onClick={this.applyFilter}><Icon name='refresh' /> SEARCH </Button>
          </GridColumn>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Filters
