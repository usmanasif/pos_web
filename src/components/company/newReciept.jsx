import React, { Component } from "react";
import Select from "react-select";
import http from "../../services/httpService";
import { Input, Form, Button, Grid, Message, Label } from "semantic-ui-react";
import { apiUrl } from "../../utils/api-config";

class NewReciept extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_item: [],
      item_count: 0,
      current_quantity: 0,
      selected_items: [],
      data: [],
      itemEmptyError: false,
      quantityEmptyError: false,
      quantityExceededError: false,
      stockEmptyError: false,
      invalidForm: false,
      invoiceCreated: false,
      total: 0,
      discounted_total: 0,
      discounts: [],
      current_discount: "",
      adjustment_amount: 0,
      totalBelowZeroError: false
    };
  }

  componentWillMount = () => {
    this.getData();
    this.getDiscounts();
  };

  getData = () => {
    http.get(apiUrl + "/api/v1/items").then(response => {
      this.setState({
        data: response.data[1]
      });
    });
  };

  getDiscounts = () => {
    http.get(apiUrl + "/api/v1/discounts").then(response => {
      this.setState({
        discounts: response.data
      });
    });
  };

  handleInputChange = event => {
    let selected_object = event;
    this.setState({ current_item: selected_object }, function() {});
  };

  errorCheck = () => {
    let quantity = this.state.current_quantity;
    let current_item = this.state.current_item;

    if (this.state.current_item.length == 0) {
      this.setState({ itemEmptyError: true });
      return false;
    } else {
      this.setState({ itemEmptyError: false });
    }

    if (this.state.current_quantity == "") {
      this.setState({ quantityEmptyError: true });
      return false;
    } else {
      this.setState({ quantityEmptyError: false });
    }

    if (current_item["current_stock"] < quantity) {
      this.setState({ quantityExceededError: true });
      return false;
    } else {
      this.setState({ quantityExceededError: false });
    }

    return true;
  };

  populateSelectedItems = () => {
    let quantity = this.state.current_quantity;
    let current_item = this.state.current_item;
    let updated = [...this.state.selected_items];

    if (!this.errorCheck()) {
      return null;
    }

    const stock = current_item["current_stock"];

    let new_quantity = current_item["current_stock"] - quantity;
    current_item["current_stock"] = new_quantity;
    this.setState({ current_item });

    let new_data = [...this.state.data];
    new_data.map((data, index) => {
      if (data.id === current_item["item_id"]) {
        data.current_stock -= quantity;
      }
    });

    let isSameItem = false;

    updated.map((data, index) => {
      if (data.item_id === current_item["item_id"]) {
        data.quantity += Number(quantity);
        isSameItem = true;
      }
    });

    let new_count = this.state.item_count;
    if (!isSameItem) {
      new_count++;
      current_item = {
        item_count: new_count,
        ...current_item,
        quantity: Number(quantity),
        original_quantity: stock,
        discount: 0
      };
      updated.push(current_item);
    }

    this.setState(
      { selected_items: updated, item_count: new_count, data: new_data },
      function() {
        this.setTotalBill();
      }
    );
  };

  setTotalBill = () => {
    let total_bill = 0.0;
    this.state.selected_items.map((data, index) => {
      let item_bill = this.itemTotal(data);

      total_bill =
        total_bill +
        item_bill;
    });

    let discounted_bill = 0.0;
    if (this.state.current_discount) {
      discounted_bill = this.discountedPrice(total_bill);
    } else {
      discounted_bill = total_bill;
    }

    if(this.state.adjustment_amount){
      discounted_bill += parseFloat(this.state.adjustment_amount);
    }

    if(discounted_bill < 0){
      this.setState({totalBelowZeroError: true})
    }
    else{
      this.setState({totalBelowZeroError: false})
    }

    this.setState({ total: total_bill, discounted_total: discounted_bill });
  };

  renderTableData() {
    return this.state.selected_items.map((data, index) => {
      const { item_count, value, unit_price, quantity, discount } = data;
      return (
        <tr key={item_count}>
          <td>{item_count}</td>
          <td>{value}</td>
          <td>{unit_price}</td>
          <td>{quantity}</td>
          <td><Button
              icon="minus"
              className="decrease-discount-icon"
              onClick={() => {
                this.decreaseDiscount(index);
              }}
            />
            { discount }%
            <Button
              icon="plus"
              className="increase-discount-icon"
              onClick={() => {
                this.increaseDiscount(index)
              }}
            />
          </td>
          <td>
            <span>{Number(this.itemTotal(data)).toFixed(2)}</span>
            <Button
              floated="right"
              icon="trash"
              className="remove-item-icon"
              onClick={() => {
                this.removeItem(index);
              }}
            />
          </td>
        </tr>
      );
    });
  }

  itemTotal = item => {
    let item_bill = parseFloat(Number(item.unit_price * item.quantity).toFixed(2));

    if(item.discount > 0){
      let discounted_bill = item_bill * (item.discount/100)
      item_bill = item_bill - discounted_bill
    }

    return item_bill;
  }

  increaseDiscount = index => {
    let new_selected = [...this.state.selected_items];
    if(new_selected[index].discount < 100) {
      new_selected[index].discount += 5;
      this.setState({selected_items: new_selected}, 
        function() {
          this.setTotalBill();
        })
    };
  }

  decreaseDiscount = index => {
    let new_selected = [...this.state.selected_items];
    if(new_selected[index].discount > 0) {
      new_selected[index].discount -= 5;
      this.setState({selected_items: new_selected}, 
        function() {
          this.setTotalBill();
        });
    }
  }

  removeItem = index => {
    let new_selected = [...this.state.selected_items];
    let new_data = [...this.state.data];
    let item = new_selected.splice(index, 1);
    let count = 0;

    //assign new indexes
    new_selected.map((data, index) => {
      count++;
      data.item_count = count;
    });

    //reset quantity
    new_data.map((data, index) => {
      if (data.id === item[0].item_id) {
        data.current_stock = item[0].original_quantity;
      }
    });

    this.setState(
      { selected_items: new_selected, data: new_data, item_count: count },
      function() {
        this.setTotalBill();
      }
    );
  };

  updateQuantity = event => {
    let new_quantity = event.target.value;
    this.setState({ current_quantity: new_quantity }, function() {});
  };

  createReciept = e => {
    if(this.state.totalBelowZeroError){
      return null;
    }

    if (this.state.selected_items.length == 0) {
      this.setState({ invalidForm: true });
      return null;
    } else {
      this.setState({ invalidForm: false });
    }

    http
      .post(apiUrl + "/api/v1/invoices", {
        total: this.state.discounted_total,
        sold_items_attributes: this.state.selected_items,
        discount_id: this.state.current_discount.id,
        adjustment: this.state.adjustment_amount
      })
      .then(response => {
        if (response.status === 201) {
          this.setState({ invoiceCreated: true });
        }
        this.getData();
        this.setState({
          selected_items: [],
          current_quantity: 0,
          current_item: [],
          total: 0,
          item_count: 0,
          current_discount: "",
          discounted_total: 0,
          adjustment_amount: 0
        });
      });
  };

  setDiscount = e => {
    let selected_discount = e;
    this.setState({ current_discount: selected_discount }, () => {
      if (this.state.total > 0) {
        let total = this.state.total;
        this.setState({ discounted_total: this.discountedPrice(total) });
      }
    });
  };

  clearDiscount = () => {
    this.setState({ current_discount: "", discounted_total: this.state.total });
  };

  discountedPrice = total_bill => {
    let discount_amount = total_bill * (this.state.current_discount.rate / 100);
    return total_bill - discount_amount;
  };

  setAdjustment = event => {
    this.setState({adjustment_amount: event.target.value}, function() {
      if(this.state.selected_items.length > 0) {
        this.setTotalBill();
      }
    })
  }

  render() {
    const itemList = this.state.data.map(
      ({ name, id, sale_price, current_stock }) => {
        return {
          value: name,
          label: name,
          unit_price: sale_price,
          current_stock: current_stock,
          item_id: id
        };
      }
    );

    return (
      <Grid centered>
        <Grid.Row>
          <Grid.Column width={6}>
            <Form error success>
              <Form.Field
                type="text"
                control={Select}
                search
                selection
                value={this.state.current_item}
                label={{ children: "Select or Search Item" }}
                options={itemList}
                onChange={this.handleInputChange}
                placeholder="Search..."
              />
              {this.state.itemEmptyError ? (
                <Message
                  error
                  header="Item not selected"
                  content="Please select an item to purchase"
                />
              ) : null}
              <Form.Field
                control={Input}
                type="number"
                value={this.state.current_quantity}
                onChange={this.updateQuantity}
                label={{
                  children: "Select Quantity",
                  htmlFor: "form-select-control-gender"
                }}
                placeholder="Quantity"
                min="1"
              />
              {this.state.quantityEmptyError ? (
                <Message
                  error
                  header="Quantity Empty"
                  content="Please provide item quantity"
                />
              ) : null}
              {this.state.quantityExceededError ? (
                <Message
                  error
                  header="Item quantity limit reached!"
                  content={
                    "Current stock only contains " +
                    this.state.current_item["current_stock"] +
                    " units"
                  }
                />
              ) : null}
              <Form.Field
                id="form-button-control-secondary"
                control={Button}
                content="Add to Invoice"
                label=""
                onClick={this.populateSelectedItems}
              />
            </Form>
          </Grid.Column>
          <Grid.Column width={10}>
            <div>
              <table className="ui compact table">
                <thead>
                  <tr>
                    <th>Item No.</th>
                    <th>Name</th>
                    <th>Sale Price</th>
                    <th>Quantity</th>
                    <th>Discount</th>
                    <th>Total($)</th>
                  </tr>
                </thead>
                <tbody>{this.renderTableData()}</tbody>
                <tfoot>
                  <tr>
                    <th />
                    <th />
                    <th />
                    <th />
                    <th>
                      <b>Total Bill:</b>
                    </th>
                    <th>{Number(this.state.total).toFixed(2)}</th>
                  </tr>
                  <tr>
                    <th />
                    <th />
                    <th />
                    <th />
                    <th className="width-32">
                      <Input type='number' 
                             placeholder='Adjustment'
                             value={this.state.adjustment_amount}
                             onChange={this.setAdjustment}>
                        <input />
                      </Input>
                    </th>
                    <th />
                  </tr>
                  <tr>
                    <th />
                    <th />
                    <th />
                    <th />
                    <th>
                      <b>Final Amount:</b>
                    </th>
                    <th>{Number(this.state.discounted_total).toFixed(2)}</th>
                  </tr>
                </tfoot>
              </table>
              {this.state.invalidForm ? (
                <Message
                  error
                  header="Invoice Empty"
                  content="Please add items to the invoice"
                />
              ) : null}
              {this.state.totalBelowZeroError ? (
                <Message
                  error
                  header="Total Below Zero"
                  content="The total bill should be greater or equal to 0"
                />
              ) : null}
              {this.state.invoiceCreated ? (
                <Message
                  success
                  header="Invoice Created"
                  content="Your invoice has been processed successfully!"
                />
              ) : null}
              <Button primary onClick={this.createReciept}>
                Pay Bill
              </Button>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default NewReciept;
