import React, { Component } from "react";
import Select from "react-select";
import http from "../../services/httpService";
import { Input, Form, Button, Grid, Message } from "semantic-ui-react";
import { apiUrl } from "../../utils/api-config";
import { Pagination } from 'semantic-ui-react'

class Reports extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invoices: [],
            page: 1,
            total_pages: 1
        };
    }

    componentWillMount = () => {
        http
            .get(apiUrl + "/api/v1/invoices?page="+this.state.page)
            .then(response => {
                console.log(response)
                this.setState({invoices: response.data.invoices, total_pages: response.data.total_pages})
            });
    }

    pageChanged = page => {
        this.setState({page: page}, function(){
            http
            .get(apiUrl + "/api/v1/invoices?page="+this.state.page)
            .then(response => {
                console.log(response)
                this.setState({invoices: response.data.invoices})
            });
        })
    }   

    renderTableData = () => {
        let count = 0;
        return this.state.invoices.map((data, index) => {
            count++;
            const { discount, total, created_at, sold_items, id } = data;
            return (
              <tr key={data.id}>
                <td>{count}</td>
                <td>{id}</td>
                <td>{created_at}</td>
                <td>{discount ? 'Yes' : 'No'}</td>
                <td>{total}</td>
                <td>{sold_items.length}</td>
              </tr>
            );
        });
    }

    render() {
        return (
            <Grid centered>
                <h2>Invoices</h2>
                <Grid.Row>
                    <Grid.Column>
                        <div>
                            <table className="ui compact table">
                                <thead>
                                    <tr>
                                        <th>Invoice No.</th>
                                        <th>Invoice ID</th>
                                        <th>Sale Date</th>
                                        <th>Discount Included</th>
                                        <th>Net Total</th>
                                        <th>Item Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>{this.renderTableData()}</tbody>
                            </table>
                        </div>
                    </Grid.Column>
                </Grid.Row>
                <Pagination defaultActivePage={1} totalPages={this.state.total_pages} onPageChange={(event, data) => this.pageChanged(data.activePage)} />
            </Grid>
        )
    }



}

export default Reports;