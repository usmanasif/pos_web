import React, { Component } from 'react';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { apiUrl } from "../../utils/api-config";
import http from "../../services/httpService";
import Paginate from "../inventory/pagination";
import Loader from "../Loader/loader"
import { Button, Table, Container, Header, Image, Grid, Input } from "semantic-ui-react";

const initialPagination = {
  activePage: 1,
  totalPages: 0,
  per_page: 6
};

class StockReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...initialPagination,
      isLoading: true,
      itemsData: [],
      allItems: [],
      item: ""
    };
  }
  
  exportPDF = () => {
      const unit = "pt";
      const size = "A4"; // Use A1, A2, A3 or A4
      const orientation = "portrait"; // portrait or landscape
  
      const marginLeft = 40;
      const doc = new jsPDF(orientation, unit, size);
  
      doc.setFontSize(15);
  
      const title = "Items Stock Report";
      const headers = [["NAME","CATEGORY", "STOCK", "UNIT PRICE"]];
      const data = this.state.allItems.map(elt=> [elt.name, elt.category.name, elt.current_stock, elt.sale_price]);

  
      let content = {
        startY: 50,
        head: headers,
        body: data
      };
  
      doc.text(title, marginLeft, 40);
      doc.autoTable(content);
      doc.save("stock_report.pdf")

  }

  handlePagination = (page, per_page) => {
    this.setState({activePage: page, per_page:per_page });
    const {item} = this.state;

    http
      .get(`${apiUrl}/api/v1/items`,{params:{page, per_page, item}})
      .then(res => {
        this.setState({
          itemsData:res.data[1],
          totalPages: res.data[0].total,
          isLoading:false
        });
      });
      this.setState({ state: this.state });
  };

  getItems = () => {
    http.get(`${apiUrl}/api/v1/items`).then(res => {
      this.setState({
        allItems: res.data[1]
      });
    });
  };

  searchHandler = e => {
    this.setState({ item: e.target.value },()=>{
      const {per_page} = this.state;
      this.handlePagination(1,per_page);
    });
  };

  componentDidMount() {
    const { activePage, per_page } = this.state;
    this.handlePagination(activePage, per_page);
    this.getItems();
  }

  render() {
    const { itemsData, activePage, per_page, totalPages,isLoading } = this.state;

    return (
      <div>
        <Container className="page-header">
          <Header as="h2" className="second-header" floated="right">
            Devsinc
          </Header>
          <Header as="h2" floated="left">
            <Image className="logo" src={require("../../images/logo.png")} />
            <span className="header-text">Stock Report</span>
          </Header>
        </Container>
        <div className="ui divider"></div>
        <Grid columns={3}>
          <Grid.Row>
            <Grid.Column>
                <Input
                  icon="search"
                  placeholder="Search Items"
                  onChange={this.searchHandler}
                />
            </Grid.Column>
            <Grid.Column floated="right">
              <Button
              icon="download"
              content="Download"
              color="green"
              onClick={() => this.exportPDF()}
              style={{float:"right"}}
            />
            </Grid.Column>
          </Grid.Row>

        </Grid>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>category</Table.HeaderCell>
              <Table.HeaderCell>Current Stock</Table.HeaderCell>
              <Table.HeaderCell>Unit Price</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {!isLoading? itemsData.map(item => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.name}</Table.Cell>
                <Table.Cell>{item.category.name}</Table.Cell>
                <Table.Cell>{item.current_stock}</Table.Cell>
                <Table.Cell>{item.sale_price}</Table.Cell>
              </Table.Row>
            )):<Loader/>}
          </Table.Body>
        </Table>
        {totalPages > 0 ? (
          <Paginate
            handlePagination={this.handlePagination}
            pageSet={{ activePage, totalPages, per_page }}
          />
        ) : <h1 className="items-record">No Record Found</h1>}
      </div>
    );
  }
}
export default StockReport