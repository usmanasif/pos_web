import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import Filters from "./filter";
import { withRouter } from "react-router";

const dateOptions = {
  year: "numeric",
  month: "long",
  day: "numeric"
};

class Vendors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Customers: [
        {
          code: "12w0",
          name: "john smith",
          mobile: "+92-300-5164870",
          address: "johar town, lahore",
          storeName: "ali mobile center",
          amount: 2500,
          dueDate: Date()
        },
        {
          code: "ab-234",
          name: "albert koping",
          mobile: "+52-324-4578964",
          address: "DHA phase 5, lahore",
          storeName: "hafeez center",
          amount: 88000,
          dueDate: Date()
        },
        {
          code: "34-we2",
          name: "Usman Asif",
          mobile: "+38-345-4545451",
          address: "Cavalery ground, lahore",
          storeName: "Devsinc",
          amount: -4520,
          dueDate: Date()
        }, {
          code: "12w0",
          name: "john smith",
          mobile: "+92-300-5164870",
          address: "johar town, lahore",
          storeName: "ali mobile center",
          amount: 2500,
          dueDate: Date()
        },
        {
          code: "ab-234",
          name: "albert koping",
          mobile: "+52-324-4578964",
          address: "DHA phase 5, lahore",
          storeName: "hafeez center",
          amount: 88000,
          dueDate: Date()
        },
        {
          code: "34-we2",
          name: "Usman Asif",
          mobile: "+38-345-4545451",
          address: "Cavalery ground, lahore",
          storeName: "Devsinc",
          amount: -4520,
          dueDate: Date()
        }

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
                    <th scope="col">Customer Code</th>
                    <th scope="col">Customer Name</th>
                    <th scope="col">Mobile</th>
                    <th scope="col">Address</th>
                    <th scope="col">Store Name</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.Customers.map(item => {
                    return (
                      <tr>
                        <th scope="row">{item.code}</th>
                        <td>{item.name}</td>
                        <td>{item.mobile}</td>
                        <td>{item.address}</td>
                        <td>{item.storeName}</td>
                        <td>{item.amount}</td>
                        <td>{new Intl.DateTimeFormat("en-PK", dateOptions).format(
                          new Date(item.dueDate)
                        )}
                        </td>
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

