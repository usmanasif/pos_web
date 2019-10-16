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
      vendorsList: []
    }
  }

  handleChangeStart = e => {
    this.setState({ startDate: e });
  };

  handleChangeEnd = e => {
    this.setState({ endDate: e });
  };

  handleChange = (e, { value }) => this.setState({ value })

  componentWillReceiveProps(nextProps) {
    const users = nextProps.users;
    Array.prototype.forEach.call(users, element => {
      this.state.vendorsList.push({
        key: element.code,
        value: element.name,
        text: element.name
      });
    });
  }

  render() {
    const {
      startDate,
      endDate,
    } = this.state;

    return (
      <Grid columns={5} centered style={{ marginTop: "25px" }}>
        <Grid.Row>
          <Grid.Column>
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
            <Dropdown placeholder='Customers' search selection options={this.state.vendorsList} />
          </Grid.Column>
          <GridColumn>
            <Button style={{ color: "white", background: "#f48f34" }}><Icon name='refresh' /> SEARCH </Button>
          </GridColumn>
        </Grid.Row>
      </Grid>
    )
  }
}

export default Filters
