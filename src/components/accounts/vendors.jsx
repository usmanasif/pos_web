import React, { Component } from "react";
import { Grid, Button, Icon } from "semantic-ui-react";
import Filters from "./filter";
import { withRouter } from "react-router";
import http from "../../services/httpService.js";
import { apiUrl } from "../../utils/api-config";
import Paginate from "../inventory/pagination"

const initialPagination = {
  activePage: 1,
  totalPages: 0,
  per_page: 10
};
class Vendors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialPagination,
      Vendors: []
    }
  }

  handleClick = (id) => this.props.history.push("accounts/" + id);

  redirect = () => this.props.history.push("/accounts/vendor/new");

  pageHandler = () => {
    const { activePage, per_page } = this.state;
    this.handlePagination(activePage, per_page);
  };

  handlePagination = (page, per_page) => {
    this.setState({ activePage: page, per_page: per_page });
    http
      .get(`${apiUrl}/api/v1/vendors`, { params: { page, per_page } })
      .then(res => {
        this.setState({
          Vendors: res.data.results[1],
          totalPages: res.data.results[0].total
        });
      })
      .catch(error => console.log(error));
  };

  componentDidMount() {
    this.pageHandler();
  }

  render() {
    const { activePage, per_page, totalPages } = this.state;

    return (
      <div>
        <Filters users={this.state.Vendors}></Filters>
        <Grid style={{marginTop:"0px"}}>
          <Grid.Column width={16}>
            <Button style={{ background: "#58ae61", color: "white" }} floated="right" onClick={this.redirect} ><Icon name="plus"></Icon>New</Button>
            <table className="table table-bordered table-striped mb-1 account-table">
              <thead style={{ color: "white", background: "#1969a4" }}>
                <tr>
                  <th scope="col">Vendor Code</th>
                  <th scope="col">Vendor Name</th>
                  <th scope="col">Store Name</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Address</th>
                </tr>
              </thead>
              <tbody>
                {this.state.Vendors.map(item => {
                  return (
                    <tr key={item.id}>
                      <th scope="row">{item.code}</th>
                      <td>{item.name}</td>
                      <td>{item.store_name}</td>
                      <td>{item.phone_number}</td>
                      <td>{item.address}</td>
                    </tr>)
                })}
              </tbody>
            </table>
            <Paginate
              handlePagination={this.handlePagination}
              pageSet={{ activePage, totalPages, per_page }}></Paginate>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}
export default withRouter(Vendors);

