import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import Filters from "./filter";
import { withRouter } from "react-router";

const dateOptions = {
  year: "numeric",
  month: "long",
  day: "numeric"
};

class Transections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Transactions: [
      ]
    }
  }

  handleClick = (id) => this.props.history.push("accounts/" + id);

  render() {
    return (
      <React.Fragment>
        <Filters></Filters>
        <Grid>
          <Grid.Column width={16}>
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
                      <tr>
                        <th scope="row">{item.transactionId}</th>
                        <td>{item.storeName}</td>
                        <td>{new Intl.DateTimeFormat("en-PK", dateOptions).format(
                          new Date(item.transactionDate)
                        )}
                        </td>
                        <td>{item.userName}</td>
                        <td>{item.amount}</td>
                        <td>{item.comment}</td>
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

