import React, { Component } from "react";
import Select from "react-select";
import http from "../../services/httpService";
import {
  Input,
  Form,
  Button,
  Grid,
  Message,
  Segment,
  Table,
  Icon,
  Modal,
  Header,
  Checkbox
} from "semantic-ui-react";
import { apiUrl } from "../../utils/api-config";
import { Pagination } from "semantic-ui-react";

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      invoices: [],
      page: 1,
      total_pages: 1,
      params: { per_page: 5, page: 1 },
      invoiceModalOpen: false
    };
  }
  openInvoiceModal = invoiceId => {
    http
      .get(`${apiUrl}/api/v1/invoices/${invoiceId}`)
      .then(({ data }) => {
        this.setState({ modalInvoice: data, invoiceModalOpen: true });
      })
      .catch(error => console.log(error));
  };

  handleClose = () => this.setState({ invoiceModalOpen: false });

  componentDidMount() {
    this.fetchData();
  }
  fetchData = () => {
    http
      .get(apiUrl + "/api/v1/invoices", { params: this.state.params })
      .then(response => {
        console.log(response.data);
        this.setState({
          invoices: response.data.invoices,
          total_count: response.data.total_count,
          total: response.data.total,
          total_pages: response.data.total_pages
        });
      });
  };
  applyFilter = () => {
    this.fetchData();
  };

  handleTodayFilter = () => {
    const params = { ...this.state.params };
    params.today ? delete params.today : (params.today = true);
    this.setState({ params });
  };

  render() {
    const { invoices, total, total_count, modalInvoice } = this.state;
    const dateOptions = {
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    };
    return (
      <div>
        <Segment
          content={
            <div>
              <div>Select Filters:</div>
              <Checkbox label="Today" onClick={this.handleTodayFilter} />
              <Button onClick={this.applyFilter}>Apply</Button>
            </div>
          }
        />
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Company</Table.HeaderCell>
              <Table.HeaderCell>Invoice ID</Table.HeaderCell>
              <Table.HeaderCell>Invoice Total</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
              <Table.HeaderCell>Time</Table.HeaderCell>
              <Table.HeaderCell />
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {invoices.map(i => (
              <Table.Row Key={i.id}>
                <Table.Cell>Devsinc</Table.Cell>
                <Table.Cell>{i.id}</Table.Cell>
                <Table.Cell>{i.total}</Table.Cell>
                <Table.Cell>
                  {new Intl.DateTimeFormat("en-PK", dateOptions).format(
                    new Date(i.created_at)
                  )}
                </Table.Cell>
                <Table.Cell>
                  {new Intl.DateTimeFormat("en-PK", timeOptions).format(
                    new Date(i.created_at)
                  )}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <Button
                    animated
                    basic
                    color="blue"
                    onClick={() => this.openInvoiceModal(i.id)}
                  >
                    <Button.Content hidden>Show</Button.Content>
                    <Button.Content visible>
                      <Icon name="file" />
                    </Button.Content>
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <Segment color="blue" textAlign="right">
          <Grid>
            <Grid.Row>
              <Grid.Column width="8">
                <h3>Total Invoices: {total_count}</h3>
              </Grid.Column>
              <Grid.Column width="8">
                <h3>Total Amount: {total}</h3>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Modal
          open={this.state.invoiceModalOpen}
          onClose={this.handleClose}
          size="small"
          dimmer="inverted"
        >
          <Modal.Content>
            {modalInvoice && (
              <Grid>
                <Grid.Row>
                  <Grid.Column width="16">
                    <Segment color="blue">
                      <Grid>
                        <Grid.Row divided>
                          <Grid.Column width="3">
                            <h4> ID: {modalInvoice.id}</h4>
                          </Grid.Column>
                          <Grid.Column width="8">
                            <h4>Created at:</h4>
                            {new Intl.DateTimeFormat("en-PK", {
                              ...dateOptions,
                              ...timeOptions
                            }).format(new Date(modalInvoice.created_at))}
                          </Grid.Column>
                          <Grid.Column width="5">
                            <h4>Created By:</h4>
                            {modalInvoice.creator_name}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Segment>
                    <Table celled>
                      <Table.Header>
                        <Table.Row>
                          <Table.HeaderCell>ID</Table.HeaderCell>
                          <Table.HeaderCell>Name</Table.HeaderCell>
                          <Table.HeaderCell>Quantity</Table.HeaderCell>
                          <Table.HeaderCell>Sold Price</Table.HeaderCell>
                          <Table.HeaderCell>Total</Table.HeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {modalInvoice.sold_items.map(item => (
                          <Table.Row key={item.id}>
                            <Table.Cell>{item.item_id}</Table.Cell>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>{item.quantity}</Table.Cell>
                            <Table.Cell>{item.unit_price}</Table.Cell>
                            <Table.Cell textAlign="center">
                              {item.quantity * item.unit_price}
                            </Table.Cell>
                          </Table.Row>
                        ))}
                      </Table.Body>
                    </Table>
                    <Segment color="blue" textAlign="right">
                      <h3>{`Total: ${modalInvoice.total}`}</h3>
                      <hr />
                      <Grid textAlign="left">
                        <Grid.Row divided>
                          <Grid.Column width="4">
                            <h4>Discount:</h4>
                            {`${
                              modalInvoice.discount
                                ? modalInvoice.discount.rate
                                : 0
                            } %`}
                          </Grid.Column>
                          <Grid.Column width="7">
                            <h4>Discount For:</h4>
                            {modalInvoice.discount &&
                              modalInvoice.discount.detail}
                          </Grid.Column>
                          <Grid.Column width="5">
                            <h4>Adjustment:</h4> {modalInvoice.adjustment}
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            )}
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default Reports;
