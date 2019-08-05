import React, { Component } from 'react';
import Select from 'react-select';
import { Input, Form, Button, Grid, Message} from 'semantic-ui-react';
import Axios from 'axios';
import {apiUrl} from "../../utils/api-config";

class NewReciept extends Component {
  constructor(props){
    super(props)
    this.state = {
      current_item: [],
      item_count: 0,
      current_quantity: 0,
      selected_items: [],
      data: [],
      itemEmptyError: false,
      quantityEmptyError: false,
      quantityExceededError: false,
      invalidForm: false,
      total: 0
    };
  }

  componentWillMount = () => {
    this.getData();
  }

  getData = () => {
    Axios.get(apiUrl+"/items")
    .then(response => {
      console.log(response);
      this.setState({
        data: response.data
      });
    });
  }

  handleInputChange = event => {
    let selected_object = event;
    this.setState({current_item: selected_object}, function () {
    });
  };

  populateSelectedItems = () => {
    let quantity = this.state.current_quantity;
    let current_item = this.state.current_item;
    let updated = [...this.state.selected_items];

    //Error handling
    if(this.state.current_item.length == 0){
      this.setState({itemEmptyError: true})
      return null;
    }
    else {
      this.setState({itemEmptyError: false})
    }

    if(this.state.current_quantity == ''){
      this.setState({quantityEmptyError: true})
      return null;
    }
    else {
      this.setState({quantityEmptyError: false})
    }

    if(current_item["current_stock"] < quantity){
      this.setState({quantityExceededError: true})
      return null;
    }
    else {
      this.setState({quantityExceededError: false})
    }

    let new_quantity = current_item["current_stock"] - quantity;
    current_item["current_stock"] = new_quantity
    this.setState({current_item})

    let new_count = this.state.item_count;
    new_count++;

    let isSameItem = false

    updated.map((data, index) => {
      if(data.item_id === current_item["item_id"]){
        data.quantity += Number(quantity)
        isSameItem = true 
      }
    });

    if(!isSameItem){
      current_item = { item_count: new_count, ...current_item, quantity: Number(quantity) };
      updated.push(current_item);
    }
    let total_bill = this.state.total;
    total_bill = total_bill + (Number((current_item["unit_price"]*quantity).toFixed(2)))
    this.setState({selected_items: updated, item_count: new_count, total: total_bill});
  }

  renderTableData() {
    return this.state.selected_items.map((data, index) => {
      const { item_count, value, unit_price, quantity } = data
      return (
          <tr key={item_count}>
            <td>{item_count}</td>
            <td>{value}</td>
            <td>{unit_price}</td>
            <td>{quantity}</td>
            <td>{Number((unit_price*quantity).toFixed(2))}</td>
          </tr>
      )
    })
  }

  updateQuantity = (event) => {
    let new_quantity = event.target.value;
    this.setState({current_quantity: new_quantity}, function () {
    });
  };

  createReciept = (e) => {
    if(this.state.selected_items.length == 0){
      this.setState({invalidForm: true})
      return null;
    }
    else {
      this.setState({invalidForm: false})
    }

    Axios.post(apiUrl+"/api/v1/invoices", {total: this.state.total, sold_items_attributes: this.state.selected_items})
      .then(response => {
        this.getData();
        this.setState({selected_items: [], current_quantity: 0, current_item: [], total: 0, item_count: 0});
      })
  }

  render() {

    const itemList = this.state.data.map(
      ({ name, id, sale_price, current_stock }) => {
        return{ 
         value: name, 
         label: name,
         unit_price: sale_price,
         current_stock: current_stock,
         item_id: id
        }
       }
    );

    return(
      <Grid centered>
        <Grid.Row>
            <Grid.Column width={10}>
              <Form error>
                <Form.Field
                  type="text"
                  control={Select}
                  search
                  selection
                  value={this.state.current_item}
                  label={{ children: 'Select or Search Item' }}
                  options={itemList}
                  onChange={this.handleInputChange}
                  placeholder= "Search..."
                />
                {this.state.itemEmptyError
                ?
                  <Message
                    error
                    header='Item not selected'
                    content='Please select an item to purchase'
                  />
                :
                null
                }
                <Form.Field
                  control={Input}
                  type="number"
                  value={this.state.current_quantity}
                  onChange={this.updateQuantity}
                  label={{ children: 'Select Quantity', htmlFor: 'form-select-control-gender' }}
                  placeholder='Quantity'  
                  min="1"
                />
                {this.state.quantityEmptyError
                ?
                  <Message
                    error
                    header='Quantity Empty'
                    content='Please provide item quantity'
                  />
                :
                null
                }
                {this.state.quantityExceededError
                ?
                  <Message
                    error
                    header='Item quantity limit reached!'
                    content={"Current stock only contains "+ this.state.current_item["current_stock"] + " units"}
                  />
                :
                null
                }
                <Form.Field
                  id='form-button-control-secondary'
                  control={Button}
                  content='Add to Invoice'
                  label=''
                  onClick={this.populateSelectedItems}
                />
                <div>
                  <table className="ui compact table">
                      <thead>
                          <tr><th>Item No.</th>
                          <th>Name</th>
                          <th>Sale Price</th>
                          <th>Quantity</th>
                          <th>Total($)</th>
                      </tr></thead>
                      <tbody>
                        {this.renderTableData()}
                      </tbody>
                      <tfoot>
                          <tr><th></th>
                          <th></th>
                          <th></th>
                          <th><b>Total Bill:</b></th>
                          <th>{Number(this.state.total).toFixed(2)}</th>
                          </tr>
                      </tfoot>
                  </table>
                  {this.state.invalidForm
                  ?
                    <Message
                      error
                      header='Invoice Empty'
                      content='Please add items to the invoice'
                    />
                  :
                  null
                  }
                  <Form.Button primary onClick={this.createReciept}>Pay Bill</Form.Button> 
                </div>

              </Form>
            </Grid.Column>
        </Grid.Row>
      </Grid>  
      
    )
  }
}

export default NewReciept;