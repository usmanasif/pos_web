import React, { Component } from "react";
import { Grid, Button, Icon } from "semantic-ui-react";
import Filters from "./filter";
import { withRouter } from "react-router";
import http from "../../services/httpService.js";
import { apiUrl } from "../../utils/api-config";

class Vendors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Vendors: [ ]
    }
  }

  handleClick = (id) => this.props.history.push("accounts/" + id);

  redirect = () => this.props.history.push("/accounts/new");

  getVendors = () => {
    http
      .get(`${apiUrl}/api/v1/vendors`)
      .then(res => {
        this.setState({
          Vendors:res.data
        });
      })
      .catch(error => console.log(error));

  }

  componentDidMount(){
    this.getVendors();
  }
  
  render() {
    return (
      <React.Fragment>
        <Filters></Filters>
        <Grid>
          <Grid.Column width={16}>
            <Button style={{ background: "#58ae61", color: "white" }} floated="right" onClick={this.redirect} ><Icon name="plus"></Icon>New</Button>
            <div className="table-wrapper-scroll-y my-custom-scrollbar">
              <table className="table table-bordered table-striped mb-0">
                <thead style={{ color: "white", background: "#1969a4" }}>
                  <tr>
                    <th scope="col">Customer Code</th>
                    <th scope="col">Customer Name</th>
                    <th scope="col">Store Name</th>
                    <th scope="col">Mobile</th>
                    <th scope="col">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.Vendors.map(item => {
                    return (
                      <tr>
                        <th scope="row">{item.code}</th>
                        <td>{item.name}</td>
                        <td>{item.store_name}</td>
                        <td>{item.phone_number}</td>
                        <td>{item.address}</td>
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
export default withRouter(Vendors);

