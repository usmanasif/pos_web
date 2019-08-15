import React, { Component } from "react";
import http from "../../services/httpService";
import { apiUrl } from "../../utils/api-config";
import { Button, Modal, Form, Dropdown } from "semantic-ui-react";
var categoryList = [];

export default class AddCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      categoryObjID: "",
      categoryName:"",
      categoryOptions: [],
      dropDownList: []
    };
  }

  initialState = () => {
    this.setState({
      open: false,
      categoryName:"",
      categoryOptions: [],
      dropDownList: []
    });
  };

  show = dimmer => () => {
    this.setState({ dimmer, open: true });
    categoryList = this.props.data;
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

  addCategory = () => {
    let categoryName = this.state.categoryName;
    let id = this.state.categoryObjID;
    let handler = this;
    http
      .post(apiUrl + "/api/v1/categories", {
        name: categoryName,
        parent_id: id
      })
      .then(function(response) {
        handler.props.addCategory();
      })
      .catch(function(error) {});

    this.initialState();
  };
  updateCategoryOptions = value => {
    var matchingObj = categoryList.find(cat => cat.name === value);
    if (matchingObj) {
      categoryList = matchingObj.children;
      this.setState({
        categoryObjID: matchingObj.id
      });
      this.createOptions(categoryList);
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

  render() {
    const { open, dimmer } = this.state;

    return (
      <div className="category">
        <Button id="addcategory" onClick={this.show("blurring")} primary>
          Add category
        </Button>
        <Modal dimmer={dimmer} open={open} onClose={this.close}>
          <Modal.Header>Add Category</Modal.Header>
          <Form className="categoryForm">
            <Form.Field>
              <label>Category</label>
              {this.state.dropDownList.map(data => data)}
            </Form.Field>
            <Form.Group widths="three">
              <Form.Input
                fluid
                label="Category Name"
                placeholder="Item name"
                name="categoryName"
                value={this.state.categoryName}
                onChange={this.onChange}
              />
            </Form.Group>
          </Form>

          <Modal.Actions>
            <Button color="black" onClick={this.close}>
              Nope
            </Button>
            <Button
              positive
              icon="checkmark"
              labelPosition="right"
              content="Add"
              onClick={this.addCategory}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
