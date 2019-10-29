import React, { Component } from 'react'
import {
  Button,
  Form,
  Container,
  Header,
  Image
} from 'semantic-ui-react';
import { withRouter } from "react-router";

import http from "../../../services/httpService.js";
import { apiUrl } from "../../../utils/api-config";

class AddProduct extends Component {
  state = {
    code: "",
    name: "",
    price: "",
    quantity: "",
    details: "",
    id: null
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value })

  addProduct = () => {
    const { code, name, price, quantity, details } = this.state;
    console.log(this.state, this.props);
    const { vendor_id, customer_id } = this.props.location.state;
    if (customer_id) {
      http
        .post(`${apiUrl}/api/v1/products`, {
          code,
          name,
          price,
          quantity,
          details,
          customer_id
        })
        .then(res => {
        })
        .catch(error => console.log(error));
    }
    else if (vendor_id) {
      http
        .post(`${apiUrl}/api/v1/products`, {
          code,
          name,
          price,
          quantity,
          details,
          vendor_id
        })
        .then(res => {
        })
        .catch(error => console.log(error));
    }
    this.props.history.push("/accounts");
  }

  render() {
    return (
      <React.Fragment>
        <Container className="page-header">
          <Header as="h2" className="second-header" floated="right">
            Devsinc
        </Header>
          <Header as="h2" floated="left">
            <Image className="logo" src={require("../../../images/logo.png")} />
            <span className="header-text">Add Product</span>
          </Header>
        </Container>
        <div className="ui divider"></div>
        <Form className="vendor-form">
          <Form.Group widths='equal'>
            <Form.Input
              label='Code'
              placeholder='Product code'
              name="code"
              onChange={this.handleChange}
            />
            <Form.Input
              label='Name'
              placeholder='Product name'
              name="name"
              onChange={this.handleChange}
            />

          </Form.Group>
          <Form.Group widths='equal'>
            <Form.Input
              label='Quantity'
              placeholder='Product quantity'
              name="quantity"
              onChange={this.handleChange}
            />
            <Form.Input
              label='Unit Price'
              placeholder='Product Unit Price'
              name="price"
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.TextArea
            label='Details'
            placeholder='Tell us more about you...'
            name="details"
            onChange={this.handleChange}
          />
          <Button onClick={this.addProduct} primary>Add</Button>
        </Form>
      </React.Fragment>
    )
  }
}

export default withRouter(AddProduct);