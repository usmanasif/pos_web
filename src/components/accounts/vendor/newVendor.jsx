import React, { Component } from 'react'
import {
  Button,
  Form,
  Input,
  Container,
  Header,
  Image
} from 'semantic-ui-react';
import { withRouter } from "react-router";

import http from "../../../services/httpService.js";
import { apiUrl } from "../../../utils/api-config";

class NewVendor extends Component {
  state = {
    code: "",
    name: "",
    store_name: "",
    phone_number: "",
    address: "",
    details: ""
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createVendor = () => {
    const { code, name, store_name, phone_number, address } = this.state
    http
      .post(`${apiUrl}/api/v1/vendors`, {
        code,
        name,
        address,
        store_name,
        phone_number
      })
      .then(res => {
        console.log(res);
      })
      .catch(error => console.log(error));

    this.props.history.push("/accounts");
  }

  render() {
    const { code, name, store_name, phone_number, address, details } = this.state
    return (
      <React.Fragment>
        <Container className="page-header">
          <Header as="h2" className="second-header" floated="right">
            Devsinc
        </Header>
          <Header as="h2" floated="left">
            <Image className="logo" src={require("../../../images/logo.png")} />
            <span className="header-text">Create Vendor</span>
          </Header>
        </Container>
        <div className="ui divider"></div>
        <Form className="vendor-form">
          <Form.Group widths='equal'>
            <Form.Input
              label='Vendor code'
              placeholder='Vendor code'
              name="code"
              value={code}
              onChange={this.handleChange}
            />
            <Form.Input
              label='Vendor name'
              placeholder='Vendor name'
              name="name"
              value={name}
              onChange={this.handleChange}
            />
            <Form.Input
              label='Address'
              placeholder='Address'
              name="address"
              value={address}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Input
              label='Store name'
              placeholder='Store name'
              name="store_name"
              value={store_name}
              onChange={this.handleChange}
            />
            <Form.Input
              control={Input}
              label='Mobile number'
              placeholder='Mobile number'
              name="phone_number"
              value={phone_number}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.TextArea
            label='Details'
            placeholder='Tell us more about you...'
            name="details"
            value={details}
            onChange={this.handleChange}
          />
          <Button onClick={this.createVendor} primary>Create</Button>
        </Form>
      </React.Fragment>
    )
  }
}

export default withRouter(NewVendor);