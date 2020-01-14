import React, { Component } from "react";
import http from "../../services/httpService";
import {
  Button,
  Grid,
  Segment,
  Table,
  Icon,
  Modal,
  Pagination,
  Container,
  Radio,
  Form,
  Checkbox,
  Dropdown,
  Header,
  Image
} from "semantic-ui-react";
import { apiUrl } from "../../utils/api-config";
import Loader from "../Loader/loader";
import DatePicker from "react-datepicker";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "react-datepicker/dist/react-datepicker.css";

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

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: false,
      isLoading: true,
      printData: [],
      current_page: 1,
      total_pages: 1,
      seletedItems: "",
      params: { per_page: 5, page: 1 },
      invoiceModalOpen: false,
      filterBy: "today",
      by_product: false,
      by_selected_products: false,
      startDate: Date(),
      endDate: Date()
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
    // this.fetchData();
    this.applyFilter();
  }
  fetchData = () => {
    http
      .get(apiUrl + "/api/v1/invoices", { params: this.state.params })
      .then(response => {
        const data = response.data.invoices
          ? { invoices: response.data.invoices }
          : response.data.products
          ? { products: response.data.products }
          : { selected_products: response.data.selected_products };
        this.setState({
          data,
          total_count: response.data.total_count,
          total: response.data.total,
          total_pages: response.data.total_pages,
          isLoading: false
        });
      });
  };
  applyFilter = () => {
    const params = { ...this.state.params };
    if (this.state.filterBy === "today") {
      params.today = true;
      delete params.from_date;
      delete params.to_date;
    }
    if (this.state.filterBy === "byDate") {
      delete params.today;
      params["from_date"] = this.state.startDate;
      params["to_date"] = this.state.endDate;
    }
    this.state.by_selected_products === true
      ? (params["by_selected_products"] = this.state.seletedItems.toString())
      : delete params["by_selected_products"];

    this.state.by_product
      ? (params.by_product = true)
      : delete params.by_product;
    params.page = 1;
    params.per_page = this.state.by_product === true ? 8 : 5;
    this.setState({ params, current_page: 1 }, () => this.fetchData());
  };

  fetchDataToPrint() {
    const params = this.state.params;
    delete params.per_page;
    delete params.page;

    http.get(apiUrl + "/api/v1/invoices", { params: params }).then(response => {
      const printData = response.data.invoices
        ? { invoices: response.data.invoices }
        : response.data.products
        ? { products: response.data.products }
        : { selected_products: response.data.selected_products };
      this.setState({ printData }, () => this.exportSalesReport());
    });
  }

  exportSalesReport = () => {
    const unit = "pt";
    const size = "A4"; // Use A1, A2, A3 or A4
    const orientation = "portrait"; // portrait or landscape
    let title = "";
    let headers = "";
    let salesContent = [];
    const marginLeft = 40;
    const doc = new jsPDF(orientation, unit, size);
    doc.setFontSize(15);

    if (this.state.printData.invoices) {
      title = "Sales Report By Date";
      headers = [["INVOICE ID", "INVOICE TOTAL", "DATE", "TIME"]];
      this.state.printData.invoices.forEach(elt => {
        const date = new Intl.DateTimeFormat("en-PK", dateOptions).format(
          new Date(elt.created_at)
        );
        const time = new Intl.DateTimeFormat("en-PK", timeOptions).format(
          new Date(elt.created_at)
        );
        salesContent.push([elt.id, elt.total, date, time]);
      });
    }

    if (this.state.printData.products) {
      title = "Sales Report By Product";
      headers = [["PRODUCT ID", "PRODUCT NAME", "SOLD QUANTITY", "TOTAL"]];
      this.state.printData.products.forEach(elt => {
        salesContent.push([
          elt.id,
          elt.name,
          elt.quantity,
          elt.total_sold_price
        ]);
      });
    }

    if (this.state.printData.selected_products) {
      title = "Sales Report By Selected Product";
      headers = [
        [
          "INVOICE ID",
          "PRODUCT ID",
          "NAME",
          "QUANTITY",
          "UNIT PRICE",
          "DATE",
          "TIME"
        ]
      ];
      this.state.printData.selected_products.forEach(elt => {
        const date = new Intl.DateTimeFormat("en-PK", dateOptions).format(
          new Date(elt.created_at)
        );
        const time = new Intl.DateTimeFormat("en-PK", timeOptions).format(
          new Date(elt.created_at)
        );
        salesContent.push([
          elt.invoice_id,
          elt.item_id,
          elt.name,
          elt.quantity,
          elt.unit_price,
          date,
          time
        ]);
      });
    }

    let content = {
      startY: 50,
      head: headers,
      body: salesContent
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("sales_report.pdf");
  };

  handlePaginationChange = (e, { activePage }) => {
    const params = { ...this.state.params };
    params.page = activePage;
    this.setState({ current_page: activePage, params }, () => {
      this.fetchData();
    });
  };
  handleChangeStart = e => {
    this.setState({ startDate: e });
  };
  handleChangeEnd = e => {
    this.setState({ endDate: e });
  };

  changeFilterOption = (e, { value }) => this.setState({ filterBy: value });
  handleByProductFilter = () => {
    const by_product = this.state.by_product;
    this.setState({ by_product: !by_product, by_selected_products: false });
  };
  handleBySelectedProducts = () => {
    const by_selected_products = this.state.by_selected_products;
    if (by_selected_products === false) {
      http
        .get(`${apiUrl}/api/v1/items`)
        .then(({ data }) => {
          const items = [];
          data[1].forEach(i =>
            items.push({ key: i.id, value: i.id, text: i.name })
          );
          this.setState({ items });
        })
        .catch(error => console.log(error));
    }
    this.setState({
      by_product: false,
      by_selected_products: !by_selected_products
    });
  };
  handleBySelectedProductsFilter = (e, { value }) => {
    this.setState({ seletedItems: value });
  };

  render() {
    const {
      data,
      items,
      total,
      total_count,
      modalInvoice,
      current_page,
      total_pages,
      startDate,
      endDate,
      isLoading
    } = this.state;

    return (
      <div>
        <Container className="page-header">
          <Header as="h2" className="second-header" floated="right">
            Devsinc
          </Header>
          <Header as="h2" floated="left">
            <Image className="logo" src={require("../../images/logo.png")} />
            <span className="header-text">Sale Report</span>
          </Header>
        </Container>
        <div className="ui divider"></div>
        <Container>
          <Form>
            <Form.Group className="filter_form_fields">
              <Form.Field width="2">
                <label>
                  <h3>Select Filter:</h3>
                </label>
              </Form.Field>
              <Form.Field width="2">
                <Radio
                  label="Today"
                  name="radioGroup"
                  value="today"
                  checked={this.state.filterBy === "today"}
                  onChange={this.changeFilterOption}
                />
              </Form.Field>
              <Form.Field width="3">
                <Radio
                  label="By Date"
                  name="radioGroup"
                  value="byDate"
                  checked={this.state.filterBy === "byDate"}
                  onChange={this.changeFilterOption}
                />
              </Form.Field>
              <Form.Field width="7">
                {this.state.filterBy === "byDate" && (
                  <React.Fragment>
                    <DatePicker
                      className="ui input date_picker_input"
                      selected={Date.parse(startDate)}
                      selectsStart
                      startDate={Date.parse(startDate)}
                      endDate={Date.parse(endDate)}
                      onChange={this.handleChangeStart}
                      isClearable={true}
                      dateFormat=" dd MMMM yyyy"
                    />

                    <DatePicker
                      className="ui input date_picker_input"
                      selected={Date.parse(endDate)}
                      selectsEnd
                      startDate={Date.parse(startDate)}
                      endDate={Date.parse(endDate)}
                      onChange={this.handleChangeEnd}
                      minDate={Date.parse(startDate)}
                      isClearable={true}
                      dateFormat=" dd MMMM yyyy"
                    />
                  </React.Fragment>
                )}
              </Form.Field>
              <Form.Field width="2">
                <Button floated="right" color="teal" onClick={this.applyFilter}>
                  Apply
                </Button>
              </Form.Field>
            </Form.Group>
            <Form.Group className="filter_form_fields">
              <Form.Field width="2" />
              <Form.Field width="2">
                <Checkbox
                  label="By Product"
                  checked={this.state.by_product}
                  onChange={this.handleByProductFilter}
                />
              </Form.Field>
              <Form.Field width="3">
                <Checkbox
                  label="By Selected Products"
                  checked={this.state.by_selected_products}
                  onChange={this.handleBySelectedProducts}
                />
              </Form.Field>
              <Form.Field width="9">
                {items && this.state.by_selected_products && (
                  <Dropdown
                    clearable
                    placeholder="Select Products"
                    fluid
                    multiple
                    search
                    selection
                    options={items}
                    onChange={this.handleBySelectedProductsFilter}
                  />
                )}
              </Form.Field>
            </Form.Group>
          </Form>
        </Container>
        {data && (
          <div>
            <Table className="filter_table" celled>
              <Table.Header>
                {data.invoices && (
                  <Table.Row>
                    <Table.HeaderCell>Company</Table.HeaderCell>
                    <Table.HeaderCell>Invoice ID</Table.HeaderCell>
                    <Table.HeaderCell>Invoice Total</Table.HeaderCell>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Time</Table.HeaderCell>
                    <Table.HeaderCell />
                  </Table.Row>
                )}
                {data.products && (
                  <Table.Row>
                    <Table.HeaderCell>Company</Table.HeaderCell>
                    <Table.HeaderCell>Product ID</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Sold Quantity</Table.HeaderCell>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                  </Table.Row>
                )}
                {data.selected_products && (
                  <Table.Row>
                    <Table.HeaderCell>Company</Table.HeaderCell>
                    <Table.HeaderCell>Name</Table.HeaderCell>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Time</Table.HeaderCell>
                    <Table.HeaderCell>Quantity</Table.HeaderCell>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">
                      Invoice
                    </Table.HeaderCell>
                  </Table.Row>
                )}
              </Table.Header>
              {!isLoading ? (
                <Table.Body>
                  {data.invoices && data.invoices.length === 0 ? (
                    <Table.Row error>
                      <Table.Cell colSpan="6">
                        <h3>No Record Found</h3>
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    data.invoices &&
                    data.invoices.map(i => (
                      <Table.Row key={i.id}>
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
                    ))
                  )}
                  {data.products && data.products.length === 0 ? (
                    <Table.Row error>
                      <Table.Cell colSpan="5">
                        <h3>No Record Found</h3>
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    data.products &&
                    data.products.map(p => (
                      <Table.Row key={p.id}>
                        <Table.Cell>Devsinc</Table.Cell>
                        <Table.Cell>{p.id}</Table.Cell>
                        <Table.Cell>{p.name}</Table.Cell>
                        <Table.Cell>{p.quantity}</Table.Cell>
                        <Table.Cell>{p.total_sold_price}</Table.Cell>
                      </Table.Row>
                    ))
                  )}
                  {data.selected_products &&
                  data.selected_products.length === 0 ? (
                    <Table.Row error>
                      <Table.Cell colSpan="7">
                        <h3>No Record Found</h3>
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    data.selected_products &&
                    data.selected_products.map(p => (
                      <Table.Row key={p.id}>
                        <Table.Cell>Devsinc</Table.Cell>
                        <Table.Cell>{p.name}</Table.Cell>
                        <Table.Cell>
                          {new Intl.DateTimeFormat("en-PK", dateOptions).format(
                            new Date(p.created_at)
                          )}
                        </Table.Cell>
                        <Table.Cell>
                          {new Intl.DateTimeFormat("en-PK", timeOptions).format(
                            new Date(p.created_at)
                          )}
                        </Table.Cell>
                        <Table.Cell>{p.quantity}</Table.Cell>
                        <Table.Cell>{p.quantity * p.unit_price}</Table.Cell>
                        <Table.Cell textAlign="center">
                          <Button
                            animated
                            basic
                            color="blue"
                            onClick={() => this.openInvoiceModal(p.invoice_id)}
                          >
                            <Button.Content hidden>Show</Button.Content>
                            <Button.Content visible>
                              {p.invoice_id}
                            </Button.Content>
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              ) : (
                <Loader />
              )}
            </Table>
          </div>
        )}
        {data && (
          <Container>
            <Pagination
              boundaryRange={0}
              activePage={current_page}
              disabled={total_pages < 2 ? true : false}
              siblingRange={1}
              onPageChange={this.handlePaginationChange}
              totalPages={total_pages}
              ellipsisItem={{
                content: <Icon name="ellipsis horizontal" />,
                icon: true
              }}
              firstItem={{
                content: <Icon name="angle double left" />,
                icon: true
              }}
              lastItem={{
                content: <Icon name="angle double right" />,
                icon: true
              }}
              prevItem={{ content: <Icon name="angle left" />, icon: true }}
              nextItem={{ content: <Icon name="angle right" />, icon: true }}
            />
            <Button
              floated="right"
              icon="download"
              content="Download Report"
              color="blue"
              onClick={() => this.fetchDataToPrint()}
              style={{ marginBottom: "10px" }}
            />
          </Container>
        )}
        {data.invoices && (
          <Segment color="blue" textAlign="right">
            <Grid>
              <Grid.Row>
                <Grid.Column width="8" textAlign="left">
                  <h3>Total Invoices: {total_count}</h3>
                </Grid.Column>
                <Grid.Column width="8">
                  <h3>Total Amount: {total}</h3>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        )}
        {data.selected_products && (
          <Segment color="blue" textAlign="right">
            <Grid>
              <Grid.Row>
                <Grid.Column width="8" textAlign="left">
                  <h3>Total Quantity: {total_count}</h3>
                </Grid.Column>
                <Grid.Column width="8">
                  <h3>Total Amount: {total}</h3>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        )}
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
