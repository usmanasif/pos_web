import React, { Component } from 'react'
import {
  Button,
  Form,
  Container,
  Header,
  Image,
} from 'semantic-ui-react';
import { withRouter } from "react-router";
import DatePicker from "react-datepicker";
import http from "../../services/httpService.js";
import { apiUrl } from "../../utils/api-config";
import "react-datepicker/dist/react-datepicker.css";

class NewTransaction extends Component {
  state = {
    code: "",
    name: "",
    vendorID: null,
    amount: "",
    details: "",
    storesList: [],
    data: [],
    startDate: Date()
  }

  handleChangeStart = e => {
    this.setState({ startDate: e });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleDropdownChange = (e, { value }) => {
    this.setState({ value });
    const { data } = this.state;
    const vendor = data.find(el => el.store_name === value);
    this.setState({
      name: vendor.name,
      vendorID: vendor.id
    });
  }

  handleStoreInfo = (element) => {
    this.state.storesList.push({
      key: element.code,
      value: element.store_name,
      text: element.store_name
    });
  }

  makeNewTransaction = () => {
    const { amount, details, code, startDate, vendorID } = this.state;
    console.log(this.state);
    http
      .post(`${apiUrl}/api/v1/transactions`, {
        transaction_code: code,
        transaction_date: startDate,
        amount: parseInt(amount),
        details: details,
        vendor_id: vendorID
      })
      .then(res => {
        this.props.history.push("/accounts")
      })
      .catch(error => console.log(error))
  }

  getVendors = () => {
    http
      .get(`${apiUrl}/api/v1/vendors`)
      .then(res => {
        const users = res.data.results[1];
        this.setState({ data: users });
        Array.prototype.forEach.call(users, element => {
          this.handleStoreInfo(element);
        });
      })
      .catch(error => console.log(error));
  }

  componentDidMount() {
    this.getVendors();
  }

  render() {
    const { code, name, details, storesList, startDate, amount } = this.state;
    return (
      <React.Fragment>
        <Container className="page-header">
          <Header as="h2" className="second-header" floated="right">
            Devsinc
        </Header>
          <Header as="h2" floated="left">
            <Image className="logo" src={require("../../images/logo.png")} />
            <span className="header-text">New Transaction</span>
          </Header>
        </Container>
        <div className="ui divider"></div>
        <Form className="vendor-form">
          <Form.Group widths='equal'>
            <Form.Input
              label='Txn code'
              placeholder='Transaction code'
              name="code"
              value={code}
              onChange={this.handleChange}
            />
            <Form.Input
              label='Amount'
              placeholder='Amount'
              name="amount"
              value={amount}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Dropdown
              onChange={this.handleDropdownChange}
              options={storesList}
              placeholder='Choose an option'
              label='Choose Store'
              selection
              value={this.state.value}
            />
            <Form.Input
              label='Vendor name'
              placeholder='Vendor name'
              name="name"
              value={name}
            />
          </Form.Group>
          <strong>Transaction Date</strong> <br />
          <DatePicker
            className="ui input date_picker_input"
            selected={Date.parse(startDate)}
            selectsStart
            startDate={Date.parse(startDate)}
            onChange={this.handleChangeStart}
            isClearable={true}
            dateFormat=" dd MMMM yyyy"
          /><br /><br />
          <Form.TextArea
            label='Comment'
            placeholder='add comment on transaction...'
            name="details"
            value={details}
            onChange={this.handleChange}
          />
          <Button onClick={this.makeNewTransaction} primary>Add</Button>
        </Form>
      </React.Fragment>
    )
  }
}

export default withRouter(NewTransaction);