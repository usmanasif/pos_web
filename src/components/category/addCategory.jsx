import React, { Component } from "react";
import http from "../../services/httpService";  
import { apiUrl } from "../../utils/api-config";
import { Button, Modal, Form, Dropdown, Message } from "semantic-ui-react";
var categoryList = [];

export default class AddCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      display: false,
      categoryObjID: "",
      categoryName:"",
      categoryOptions: [],
      dropDownList: [],
      ancestorOptions:[]
    };
  }

  initialState = () => {
    this.setState({
      open: false,
      display: false,
      categoryObjID: "",
      categoryName:"",
      categoryOptions: [],
      dropDownList: [],
      ancestorOptions:[]
    });
  };

  show = dimmer => () => {
    this.setState({ dimmer, open: true });
    categoryList = this.props.data;
    this.state.ancestorOptions.push(categoryList);
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
    const {categoryName, categoryObjID} = this.state;
    let handler = this;
    if(categoryName){
      http
        .post(apiUrl + "/api/v1/categories", {
          name: categoryName,
          parent_id: categoryObjID
        })
        .then(function(response) {
          handler.props.addCategory();
        })
        .catch(function(error) {});

      this.initialState();
    }
    else{
      this.setState({display:true});
      setTimeout(()=>{ 
        this.setState({display:false});
       }, 5000);
    }
  };

  updateCategoryOptions = value => {
    var matchingObj;
    var objCategory;
    var index = 0 ;
    const {ancestorOptions, dropDownList} = this.state;
    ancestorOptions.forEach((categoryOptions, i)=>{
      matchingObj = categoryOptions.find(cat => cat.name === value);
         if(matchingObj){
            objCategory=matchingObj;
            index = i;
         }
    });
  
    if (objCategory) {
      for(let i=0;i<dropDownList.length; i++){
          if(i>index){
            dropDownList[i]=null;
          }
      }

      this.setState({ state: this.state });

      categoryList = objCategory.children;
      ancestorOptions.push(categoryList);
      this.setState({
        categoryObjID: objCategory.id
      });
      this.createOptions(categoryList);
    }
  };

  createOptions = options => {
    let penalArray = [];
    
    if (options.length > 0) {
      options.forEach(data => {
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
          key={Math.random()}
          options={opt}
          onChange={this.handleChange}
        />
      );
      this.state.dropDownList.push(dropdown);
      this.setState({ state: this.state });
    }
  };

  render() {
    const { open, dimmer, categoryName, dropDownList, display } = this.state;

    return (
      <div className="category">
        <Button id="addcategory" onClick={this.show("blurring")} primary>
          Add category
        </Button>
        <Modal className="cat-modal" dimmer={dimmer} open={open} onClose={this.close}>
          <Modal.Header>Add Category</Modal.Header>
          <Form className="categoryForm">
            <Form.Field>
              <Message info
                list={[
                        'if you want to add parent category leave the "Category" field as blank.',
                        'if you want to add sub-category select the parent category from "Category" field.',
                      ]}
                      />

            </Form.Field>
            {dropDownList.length>0?
              <Form.Field>
                <label>Category</label>
                {dropDownList.map(data => data)}
              </Form.Field>:null
            }
            <Form.Group widths="three">
              <Form.Input
                fluid
                label="Category Name"
                placeholder="Item name"
                name="categoryName"
                value={categoryName}
                onChange={this.onChange}
                required
                />
            </Form.Group>
            {display?
                <Message negative>
                  <Message.Header>field can not be empty</Message.Header>
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
              content="Add"
              onClick={this.addCategory}
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}
