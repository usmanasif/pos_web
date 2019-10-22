import React, { Component } from "react";
import { Grid, Button, Icon } from "semantic-ui-react";
import Filters from "./filter";
import { withRouter } from "react-router";
import http from "../../services/httpService.js";
import { apiUrl } from "../../utils/api-config";
import Paginate from "../inventory/pagination"

const dateOptions = {
  year: "numeric",
  month: "long",
  day: "numeric"
};

const initialPagination = {
  activePage: 1,
  totalPages: 0,
  per_page: 10
};

class Transections extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialPagination,
      Transactions: [],
      Vendors: []
    }
  }

  handleClick = (id) => this.props.history.push("accounts/" + id);

  redirect = () => this.props.history.push("accounts/transaction/new");

  pageHandler = () => {
    const { activePage, per_page } = this.state;
    this.handlePagination(activePage, per_page);
  };

  handlePagination = (page, per_page) => {
    this.setState({ activePage: page, per_page: per_page });
    http
      .get(`${apiUrl}/api/v1/transactions`, { params: { page, per_page } })
      .then(res => {
        this.setState({
          Transactions: res.data.results[1],
          totalPages: res.data.results[0].total
        });
      })
      .catch(error => console.log(error))
  };

  getVendors = () =>{
    http
      .get(`${apiUrl}/api/v1/vendors`)
      .then(res => {
        this.setState({
          Vendors: res.data.results[1]
        });
      })
      .catch(error => console.log(error));
  }

  filterTransactions = (transactions) =>{
    http
      .get(`${apiUrl}/api/v1/transactions`, {params:transactions})
      .then(res => {
        console.log(res);
        this.setState({
          Transactions: res.data.results[1],
          totalPages: res.data.results[0].total
        });
      })
      .catch(error => console.log(error))
  }

  componentDidMount() {
    this.pageHandler();
    this.getVendors();
  }

  render() {
    const {activePage, per_page, totalPages, Vendors, Transactions} = this.state;
    return (
      <React.Fragment>
        <Filters users={Vendors} filterTransactions={this.filterTransactions}></Filters>
        <Grid>
          <Grid.Column width={16}>
            <Button style={{ background: "#58ae61", color: "white" }} floated="right" onClick={this.redirect}><Icon name="plus"></Icon>New</Button>
            <div className="table-wrapper-scroll-y my-custom-scrollbar">
              <table className="table table-bordered table-striped mb-1 account-table">
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
                  {Transactions.map(item => {
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
              <Paginate
              handlePagination={this.handlePagination}
              pageSet={{ activePage, totalPages, per_page }}></Paginate>
            </div>
          </Grid.Column>
        </Grid>
      </React.Fragment>
    )
  }
}
export default withRouter(Transections);

