import React, { Component } from "react";
import {
  Button,
  Modal,
  Form,
  TextArea,
  Dropdown,
  Message
} from "semantic-ui-react";
import http from "../../services/httpService.js";
import { apiUrl } from "../../utils/api-config";

var itemList = [];

export default class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      display: false,
      code: "",
      name: "",
      quantity: "",
      price: "",
      category: "",
      categoryOptions: [],
      dropDownList: [],
    };
  }
  initialState = () => {
    this.setState({
      open: false,
      display: false,
      code: "",
      name: "",
      quantity: "",
      price: "",
      category: "",
      categoryObjID: "",
      categoryOptions: [],
      dropDownList: [],
    });
  };

  setDefaultState = props => {
    const { name, code, current_stock, sale_price, category } = props;
    this.setState({ 
      name, 
      code,
      quantity: current_stock, 
      price: sale_price, 
      category 
    });
  };

  show = dimmer => () => {
    this.setState({ dimmer, open: true });
    itemList = this.props.data;
    this.createOptions(this.props.data);
  };
  
  close = () => this.initialState();

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleChange = (e, { value }) => {
    this.setState({ value });
    this.updateCategoryOptions(value);
  };

  addItem = () => {
    const { code, name, quantity, price, categoryObjID } = this.state;

    if(code && name && quantity && price && categoryObjID){
      http
        .post(`${apiUrl}/api/v1/items`, {
          code,
          name,
          current_stock: quantity,
          sale_price: price,
          category_id: categoryObjID
        })
        .then(res => {
          this.props.addItem();
        })
        .catch(error => console.log(error));
        
      this.initialState();
    }
    else{
      this.setState({
        display:true
      });
    }
  };

  editItem = () => {
    const {id} = this.props.itemData;
    const { code, name, quantity, price , categoryObjID} = this.state;

    if(code && name && quantity && price){
    // api call to update item
      http
        .put(`${apiUrl}/api/v1/items/${id}`, {
          code,
          name,
          current_stock: quantity,
          sale_price: price,
          category_id: categoryObjID
        })
        .then(res => {
          this.props.editItem();
        })
        .catch(error => console.log(error));

        this.setState({
          open: false,
          categoryOptions: [],
          dropDownList: [],
        });
      }
      else{
        this.setState({
          display:true
        });
      }
    };

  updateCategoryOptions = value => {
    var matchingObj = itemList.find(cat => cat.name === value);
    if (matchingObj) {
      itemList = matchingObj.children;
      this.setState({
        categoryObjID: matchingObj.id
      });
      this.createOptions(itemList);
    }
  };  

  createOptions = options => {
    let penalArray = [];
    if (options && options.length > 0) {
      options.map(data => {
        penalArray.push({ key: data.id, text: data.name, value: data.name });
      });
    }
    this.setState({ categoryOptions: penalArray });
    this.createDropDown(penalArray);
  };

  createDropDown = opt => {
    if (opt.length > 0) {
      let dropdown = (
        <Dropdown
          placeholder="category"
          fluid
          selection
          options={opt}
          onChange={this.handleChange}
        />
      );
      this.state.dropDownList.push(dropdown);
      this.setState({ state: this.state });
    }
  };

  componentDidMount() {
    if (this.props.itemData) {
      this.setDefaultState(this.props.itemData);
    }
  }

  render() {
    const { open, display, dropDownList, dimmer } = this.state;

    return (
      <React.Fragment>
        {this.props.itemData && (
          <Button color="green" icon="edit" onClick={this.show("edit")} />
        )}
        <div className="item">
          {!this.props.itemData && (
            <Button id="addItem" onClick={this.show("add")} primary>
              Add item
            </Button>
          )}
          <Modal dimmer = {dimmer} open={open} onClose={this.close}>
            <Modal.Header>{this.props.itemData ? "Edit Item" : "Add Item"}</Modal.Header>
            <Form className="itemForm">
              <Form.Group widths="2">
                <Form.Input
                  fluid
                  label="Code"
                  placeholder="Item code"
                  name="code"
                  onChange={this.onChange}
                  value={this.state.code}
                  required
                />
                <Form.Input
                  fluid
                  label="Name"
                  placeholder="Item name"
                  name="name"
                  onChange={this.onChange}
                  value={this.state.name}
                  required
                />
              </Form.Group>
              <Form.Group widths="2">
                <Form.Input
                  fluid
                  label="Quantity"
                  placeholder="Item quantity"
                  name="quantity"
                  onChange={this.onChange}
                  value={this.state.quantity}
                  required
                />
                <Form.Input
                  fluid
                  label="Price"
                  placeholder="Item price"
                  name="price"
                  onChange={this.onChange}
                  value={this.state.price}
                  required
                />
              </Form.Group>
              <Message info content="select the category in which you want to add item" />
              <Form.Field required>
                <label>Category</label>
                {dropDownList.map(data => data)}
              </Form.Field>
              <Form.Field>
                <label>Description</label>
                <TextArea placeholder="Tell more about Item" rows={4} />
              </Form.Field>
              {display?
                <Message negative>
                  <Message.Header>fields can not be empty</Message.Header>
                  <p>check the fields with red-star, these should not be empty </p>
                </Message>
              :null}
            </Form>

            <Modal.Actions>
              <Button color="black" onClick={this.close}>
                Cancel
              </Button>
              <Button
                positive
                icon="checkmark"
                labelPosition="right"
                content={this.props.itemData ? "Update" : "Add"}
                onClick={this.props.itemData ? this.editItem : this.addItem}
              />
            </Modal.Actions>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}
