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
      ancestorOptions:[]
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
      ancestorOptions:[]
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

  show  = () => {
    this.setState({ open: true });
    itemList = this.props.data;
    this.state.ancestorOptions.push(itemList);
    this.createOptions(this.props.data);
  };
  
  close = () => this.initialState();

  cancel = key => {
    if(key === "add")
      this.initialState()
    else{
      const {code, current_stock, sale_price, name} = this.props.itemData;
      this.setState({
        open: false,
        display: false,
        code: code,
        name: name,
        quantity: current_stock,
        price: sale_price,
        dropDownList: [],
        ancestorOptions:[]
      });
    }
  }


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
          
          itemList = objCategory.children;
          ancestorOptions.push(itemList);
          this.setState({
            categoryObjID: objCategory.id
          });
          this.createOptions(itemList);
        }
      };
      
      
      createOptions = options => {
        let penalArray = [];
        if (options && options.length > 0) {
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

  componentDidMount() {
    if (this.props.itemData) {
      this.setDefaultState(this.props.itemData);
    }
  }

  render() {
    const { open, display, dropDownList, code, name, quantity, price } = this.state;
    const { itemData } = this.props;

    return (
      <React.Fragment>
        {itemData && (
          <Button color="green" icon="edit" onClick={()=>this.show("edit")} />
        )}
        <div className="item">
          {!itemData && (
            <Button id="addItem" onClick={()=>this.show("add")} primary>
              Add item
            </Button>
          )}
          <Modal dimmer = "blurring" open={open} onClose={this.close}>
            <Modal.Header>{itemData ? "Edit Item" : "Add Item"}</Modal.Header>
            <Form className="itemForm">
              <Form.Group widths="2">
                <Form.Input
                  fluid
                  label="Code"
                  placeholder="Item code"
                  name="code"
                  onChange={this.onChange}
                  value={code}
                  required
                />
                <Form.Input
                  fluid
                  label="Name"
                  placeholder="Item name"
                  name="name"
                  onChange={this.onChange}
                  value={name}
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
                  value={quantity}
                  required
                />
                <Form.Input
                  fluid
                  label="Price"
                  placeholder="Item price"
                  name="price"
                  onChange={this.onChange}
                  value={price}
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
              <Button color="black" onClick={itemData? ()=>this.cancel("edit"): ()=>this.cancel("add")}>
                Cancel
              </Button>
              <Button
                positive
                icon="checkmark"
                labelPosition="right"
                content={itemData ? "Update" : "Add"}
                onClick={itemData ? this.editItem : this.addItem}
              />
            </Modal.Actions>
          </Modal>
        </div>
      </React.Fragment>
    );
  }
}
