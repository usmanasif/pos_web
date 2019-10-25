import React, { Component } from 'react'
import {
  Button,
  Form,
  Container,
  Header,
  Image,
  Message
} from 'semantic-ui-react';
import { withRouter } from "react-router";
import DatePicker from "react-datepicker";
import http from "../../services/httpService.js";
import { apiUrl } from "../../utils/api-config";
import "react-datepicker/dist/react-datepicker.css";

const options = [
  {
    key: "ba",
    text: "Bank Account",
    value: "Bank Account"
  },
  {
    key: "cost",
    text: "Costing",
    value: "Costing"
  },
  {
    key: "cred",
    text: "Credit Card",
    value: "Credit Card"
  },
       
  {
    key: "rep",
    text: "Repairing",
    value: "Repairing"
  },
  {
    key: "fexp",
    text: "Fuel Expense",
    value: "Fuel Expense"
  },
  {
    key: "expe",
    text: "Expense",
    value: "Expense"
  },
  {
    key: "etx",
    text: "Entertainment Expense",
    value: "Entertainment Expense"
  },
  {
    key: "inc",
    text: "Misc Income",
    value: "Misc Income"
  },
  {
    key: "sal",
    text: "Salary",
    value: "Salary"
  },
  {
    key: "elc",
    text: "Electricity Bill",
    value: "Electricity Bill"
  },
  {
    key: "exp",
    text: "Other Expense",
    value: "Other Expense"
  }
]

class NewTransaction extends Component {
  state = {
    code: "",
    name: "",
    vendorID: null,
    amount: "",
    details: "",
    account: "",
    account_type: "",
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

  handleAccountChange = (e, { name, value }) => {
    this.setState({ [name]: value }, () => {
      const { account } = this.state;
      if (account === "Misc Income") {
        this.setState({
          account_type: "Receiveable"
        },()=>this.setAmount());
      }
      else if (account === "Bank Account" || account === "Credit Card") {
        this.setState({
          account_type: "General"
        },()=>this.setAmount());
      }
      else {
        this.setState({
          account_type: "Payable"
        },()=>this.setAmount());
      }
    })
  };

  setAmount = () => {
    const { account, amount } = this.state;
    if (account === "Misc Income") {
      if (amount < 0) {
        this.setState(prevstate => ({
          amount: prevstate.amount * (-1)
        }));
      }
    }
    else if (account === "Bank Account" || account === "Credit Card") {
      this.setState(prevstate => ({
        amount: prevstate.amount
      }));
    }
    else {
      if (amount > 0) {
        this.setState(prevstate => ({
          amount: prevstate.amount * (-1)
        }));
      }
    }
  }


  handleStoreInfo = (element) => {
    this.state.storesList.push({
      key: element.code,
      value: element.store_name,
      text: element.store_name
    });
  }

  makeNewTransaction = () => {
    const { amount, details, code, startDate, vendorID, account_type, account } = this.state;
    http
      .post(`${apiUrl}/api/v1/transactions`, {
        transaction_code: code,
        transaction_date: startDate,
        amount: parseInt(amount),
        details: details,
        vendor_id: vendorID,
        account_type: account_type,
        transaction_category:account
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
    const { code, name, details, storesList, startDate, amount, account_type } = this.state;
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
              type="number"
              value={amount}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Message info style={{ padding: "10px" }}>
            <strong>{`Select vendor, only if transaction happened with any vendor, Otherwise leave it blank`}</strong>
          </Message>
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
          <Form.Group>
            <Form.Dropdown
              onChange={this.handleAccountChange}
              options={options}
              placeholder='Choose an option'
              label='Select account'
              name="account"
              selection
              value={this.state.account}
            />
            {account_type === "General" ?
              <Message positive >
                <strong>{`This is "General" account type where you can Add Cash (+) OR Remove Cash (-) only`}</strong>
              </Message> : account_type === "Payable" ? <Message negative>
                <strong>{`This is "Expense" account type where you can Remove Cash (-) only`}</strong>
              </Message> : account_type === "Receiveable" ? <Message positive>
                <strong>{`This is "Income" account type where you can Add Cash (+) only`}</strong>
              </Message> : null
            }

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