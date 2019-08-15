import React, { Component } from "react";
import {
  Button,
  Modal,
  Form,
  TextArea,
  Dropdown
} from "semantic-ui-react";
import http from "../../services/httpService.js";
import { apiUrl } from "../../utils/api-config";

var itemList = [];

export default class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
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
      code: "",
      name: "",
      quantity: "",
      price: "",
      category: "",
      prevObjID: "",
      categoryOptions: [],
      dropDownList: [],
    });
  };

  setDefaultState = props => {
    const { name, quantity, price, category } = props;
    this.setState({ name, quantity, price, category });
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
    const { code, name, quantity, price, prevObjID } = this.state;

    http
      .post(`${apiUrl}/api/v1/items`, {
        code,
        name,
        current_stock: quantity,
        sale_price: price,
        category_id: prevObjID
      })
      .then(res => {
        this.props.addItem();
      })
      .catch(error => console.log(error));
      
    this.initialState();
  };

  editItem = () => {
    const { id, children } = this.props.itemData;
    const { name, quantity, price} = this.state;
    this.props.editItem({ id, name, price, quantity, children });
    this.setState({
      open: false,
      categoryOptions: [],
      dropDownList: [],
    });
  };


  updateCategoryOptions = value => {
    var matchingObj = itemList.find(cat => cat.name === value);
    if (matchingObj) {
      itemList = matchingObj.children;
      this.setState({
        prevObjID: matchingObj.id
      });
      this.createOptions(itemList);
    }
  };

  

  createOptions = options => {
    let penalArray = [];
    if (options.length > 0) {
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
    const { open } = this.state;

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
          <Modal open={open} onClose={this.close}>
            <Modal.Header>Add Item</Modal.Header>
            <Form className="itemForm">
              <Form.Group widths="2">
                <Form.Input
                  fluid
                  label="Code"
                  placeholder="Item code"
                  name="code"
                  onChange={this.onChange}
                  value={this.state.code}
                />
                <Form.Input
                  fluid
                  label="Name"
                  placeholder="Item name"
                  name="name"
                  onChange={this.onChange}
                  value={this.state.name}
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
                />
                <Form.Input
                  fluid
                  label="Price"
                  placeholder="Item price"
                  name="price"
                  onChange={this.onChange}
                  value={this.state.price}
                />
              </Form.Group>
              <br />
              <Form.Field>
                <label>Category</label>
                {this.state.dropDownList.map(data => data)}
              </Form.Field>
              <Form.Field>
                <label>Description</label>
                <TextArea placeholder="Tell more about Item" rows={4} />
              </Form.Field>
            </Form>

            <Modal.Actions>
              <Button color="black" onClick={this.close}>
                Nope
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
