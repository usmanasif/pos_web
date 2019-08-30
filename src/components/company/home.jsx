import React, { Component } from "react";
import {
  Card,
  Image,
  Grid,
  Container,
  Header,
  Segment,
  Label
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import StockByCategoryChart from "../charts/stockByCategoryChart";
import SalesByCategoryChart from "../charts/salesByCategoryChart";
import LastWeekSalesChart from "../charts/lastWeekSalesChart";
import ItemsStockChart from "../charts/itemsStockChart";

class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <Container className="page-header">
          <Header as="h2" className="second-header" floated="right">
            Devsinc
          </Header>
          <Header as="h2" floated="left">
            <Image
              className="logo"
              src={require("../../images/company_icon.jpeg")}
            />
            <span className="header-text">Dashboard</span>
          </Header>
        </Container>
        <div className="ui divider"></div>
        <Grid columns={5}>
          <Grid.Row>
            <Grid.Column>
              <Link to="/reciept">
                <Card raised>
                  <Image
                    src={require("../../images/invoice.jpg")}
                    wrapped
                    ui={false}
                  />
                  <Card.Content>
                    <Card.Header className="card-heading">
                      New Invoice
                    </Card.Header>
                  </Card.Content>
                </Card>
              </Link>
            </Grid.Column>
            <Grid.Column>
              <Link to="/inventory">
                <Card raised>
                  <Image
                    src={require("../../images/inventory.jpg")}
                    wrapped
                    ui={false}
                  />
                  <Card.Content>
                    <Card.Header className="card-heading">
                      Item Inventory
                    </Card.Header>
                  </Card.Content>
                </Card>
              </Link>
            </Grid.Column>
            <Grid.Column>
              <Link to="/reports">
                <Card raised>
                  <Image
                    src={require("../../images/reports.jpeg")}
                    wrapped
                    ui={false}
                  />
                  <Card.Content>
                    <Card.Header className="card-heading">
                      Sale Reports
                    </Card.Header>
                  </Card.Content>
                </Card>
              </Link>
            </Grid.Column>
            <Grid.Column>
              <Link to="/stock_report">
                <Card raised>
                  <Image
                    src={require("../../images/stock_report.jpg")}
                    wrapped
                    ui={false}
                  />
                  <Card.Content>
                    <Card.Header className="card-heading">
                      Stock Report
                    </Card.Header>
                  </Card.Content>
                </Card>
              </Link>
            </Grid.Column>
            <Grid.Column>
              <Card raised>
                <Image
                  src={require("../../images/returns.jpg")}
                  wrapped
                  ui={false}
                />
                <Card.Content>
                  <Card.Header className="card-heading">Returns</Card.Header>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column width="8">
              <Segment raised>
                <Label ribbon size="big" color="blue">
                  Stock By Category
                </Label>
                <StockByCategoryChart />
              </Segment>
            </Grid.Column>
            <Grid.Column width="8">
              <Segment raised>
                <Label ribbon size="big" color="blue">
                  Sales By Category
                </Label>
                <SalesByCategoryChart />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="16">
              <Segment raised>
                <Label size="big" color="blue" ribbon>
                  Last Week Sales
                </Label>
                <LastWeekSalesChart />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="16">
              <Segment raised>
                <Label size="big" color="blue" ribbon>
                  Products Available Stock
                </Label>
                <ItemsStockChart />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

export default Home;
