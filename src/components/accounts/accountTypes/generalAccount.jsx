import React, { Component } from "react";
import { Label } from "semantic-ui-react";
import http from "../../../services/httpService.js";
import { apiUrl } from "../../../utils/api-config";

const dateOptions = {
  year: "numeric",
  month: "long",
  day: "numeric"
};
class GeneralAccount extends Component {
  state = {
    transactions: [],
    initialBalance: 0,
    totalAmount: 0,
    remainingAmount: 0
  }
  calculateAmount = () => {
    const { transactions } = this.state
    Array.prototype.forEach.call(transactions, element => {
      if (element.amount > 0) {
        this.setState(prevstate => ({
          totalAmount: prevstate.totalAmount + element.amount
        }));
      }
      this.setState(prevstate => ({
        remainingAmount: prevstate.remainingAmount + element.amount
      }));
    });
  }

  getVendorTransactions = () => {
    http
      .get(`${apiUrl}/api/v1/transactions`, { params: { account_type: "General" } })
      .then(res => {
        this.setState({
          transactions: res.data.results[1]
        }, () => {
          this.calculateAmount();
        });
      })
      .catch(error => console.log(error))
  }


  componentDidMount() {
    this.getVendorTransactions();
  }

  render() {
    const { transactions, initialBalance, totalAmount, remainingAmount } = this.state;
    return (
      <React.Fragment>
        <div style={{ textAlign: "center" }}>
          <Label as='a' color='blue' size="large">
            Initial Balance:
            <Label.Detail>{initialBalance}</Label.Detail>
          </Label>
          <Label as='a' color='teal' size="large">
            Payable Amount:
            <Label.Detail>{totalAmount}</Label.Detail>
          </Label>
          <Label as='a' color='green' size="large">
            Paid Amount:
            <Label.Detail>{totalAmount - remainingAmount}</Label.Detail>
          </Label>
          <Label as='a' color='yellow' size="large">
            Remaining Amount:
            <Label.Detail>{remainingAmount}</Label.Detail>
          </Label>
        </div>

        <h3 style={{marginTop:"5px"}}>Transactions</h3>
        <table className="table table-bordered table-striped mb-1 account-table">
          <thead style={{ color: "white", background: "#1969a4" }}>
            <tr>
              <th scope="col">Txn ID</th>
              <th scope="col">Amount</th>
              <th scope="col">Date</th>
              <th scope="col">Details</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(item => {
              return (
                <tr key={item.id}>
                  <th scope="row">{item.transaction_code}</th>
                  <td>{item.amount}</td>
                  <td>{new Intl.DateTimeFormat("en-PK", dateOptions).format(
                    new Date(item.transaction_date)
                  )}
                  </td>
                  <td>{item.details}</td>

                </tr>)
            })}
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}

export default GeneralAccount;