import React, { Component } from "react";
import { Grid, Button, Icon } from "semantic-ui-react";
import Filters from "./filter";
import { withRouter } from "react-router";
import http from "../../services/httpService.js";
import { apiUrl } from "../../utils/api-config";

const dateOptions = {
  year: "numeric",
  month: "long",
  day: "numeric"
};

class Transections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Transactions: []
    }
  }

  handleClick = (id) => this.props.history.push("accounts/" + id);

  redirect = () => this.props.history.push("accounts/transaction/new");

  getTransactions = () => {
    http
      .get(`${apiUrl}/api/v1/transactions`)
      .then(res => {
        console.log(res);
        this.setState({
          Transactions: res.data
        });
      })
      .catch(error => console.log(error))
  }

  componentDidMount() {
    this.getTransactions();
  }

  render() {
    return (
      <React.Fragment>
        <Filters></Filters>
        <Grid>
          <Grid.Column width={16}>
            <Button style={{ background: "#58ae61", color: "white" }} floated="right" onClick={this.redirect}><Icon name="plus"></Icon>New</Button>
            <div className="table-wrapper-scroll-y my-custom-scrollbar">
              <table className="table table-bordered table-striped mb-0">
                <thead style={{ color: "white", background: "#1969a4" }}>
                  <tr>
                    <th scope="col">Txn ID  </th>
                    <th scope="col">Store Name</th>
                    <th scope="col">Transaction Date</th>
                    <th scope="col">User Name</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Comments</th>

                  </tr>
                </thead>
                <tbody>
                  {this.state.Transactions.map(item => {
                    return (
                      <tr key={item.id}>
                        <th scope="row">{item.transaction_code}</th>
                        <td>{item.vendor.store_name}</td>
                        <td>{new Intl.DateTimeFormat("en-PK", dateOptions).format(
                          new Date(item.transaction_date)
                        )}
                        </td>
                        <td>{item.vendor.name}</td>
                        <td>{item.amount}</td>
                        <td>{item.details}</td>
                      </tr>)
                  })}
                </tbody>
              </table>
            </div>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    )
  }
}
export default withRouter(Transections);

