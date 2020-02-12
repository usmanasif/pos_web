import React, { Component } from "react";
import { Button, Modal, Form, Dropdown, Message } from "semantic-ui-react";
import http from "../../services/httpService.js";
import { apiUrl } from "../../utils/api-config";

var itemList = [];

export default class AddItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      display: false,
      name: "",
      category: "",
      categoryOptions: [],
      dropDownList: [],
      ancestorOptions: [],
      item_sizes_attributes: [
        {
          code: "",
          discount: 0,
          quantity: 0,
          price: 0,
          size_attributes: { size_type: "" }
        }
      ],
      sizeOptions: []
    };
  }

  initialState = () => {
    this.setState({
      open: false,
      display: false,
      item_sizes_attributes: [
        {
          code: "",
          discount: 0,
          quantity: 0,
          price: 0,
          size_attributes: { size_type: "" }
        }
      ],
      category: "",
      categoryObjID: "",
      categoryOptions: [],
      dropDownList: [],
      ancestorOptions: []
    });
  };

  setDefaultState = props => {
    const { name, code, current_stock, sale_price, category, discount } = props;
    this.setState({
      name,
      code,
      discount,
      quantity: current_stock,
      price: sale_price,
      category
    });
  };

  show = () => {
    this.setState({ open: true });
    itemList = this.props.data;
    this.state.ancestorOptions.push(itemList);
    this.createOptions(this.props.data);
    this.createSizesOptions();
  };

  close = () => this.initialState();

  cancel = key => {
    if (key === "add") this.initialState();
    else {
      const {
        code,
        current_stock,
        sale_price,
        name,
        discount
      } = this.props.itemData;
      this.setState({
        open: false,
        display: false,
        code: code,
        name: name,
        discount: discount,
        quantity: current_stock,
        price: sale_price,
        dropDownList: [],
        ancestorOptions: []
      });
    }
  };

  onChange = e => {
    if (["code", "discount", "quantity", "price"].includes(e.target.name)) {
      let item_sizes_attributes = [...this.state.item_sizes_attributes];
      item_sizes_attributes[e.target.id.slice(-1)][e.target.name] =
        e.target.value;
      this.setState({ item_sizes_attributes });
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  };

  handleChange = (e, { value }) => {
    this.setState({ value });
    this.updateCategoryOptions(value);
  };

  handleSizeChange = (event, index) => {
    const element = event.target.firstElementChild;
    const item_sizes_attributes = [...this.state.item_sizes_attributes];
    const size_attributes = {
      ...item_sizes_attributes[index].size_attributes
    };
    size_attributes.size_type = element.textContent;
    item_sizes_attributes[index]["size_attributes"] = size_attributes;
    this.setState({ item_sizes_attributes });
  };

  addItem = () => {
    const { name, categoryObjID, item_sizes_attributes } = this.state;

    if (name && categoryObjID && item_sizes_attributes) {
      http
        .post(`${apiUrl}/api/v1/items`, {
          name,
          category_id: categoryObjID,
          item_sizes_attributes
        })
        .then(res => {
          this.props.addItem();
        })
        .catch(error => console.log(error));

      this.initialState();
    } else {
      this.setState({ display: true });
      setTimeout(() => {
        this.setState({ display: false });
      }, 5000);
    }
  };

  editItem = () => {
    const { id } = this.props.itemData;
    const { code, name, quantity, price, categoryObjID, discount } = this.state;

    if (code && name && quantity && price) {
      // api call to update item
      http
        .put(`${apiUrl}/api/v1/items/${id}`, {
          code,
          name,
          current_stock: quantity,
          sale_price: price,
          category_id: categoryObjID,
          discount
        })
        .then(res => {
          this.props.editItem();
        })
        .catch(error => console.log(error));

      this.setState({
        open: false,
        categoryOptions: [],
        dropDownList: []
      });
    } else {
      this.setState({ display: true });
      setTimeout(() => {
        this.setState({ display: false });
      }, 5000);
    }
  };

  updateCategoryOptions = value => {
    var matchingObj;
    var objCategory;
    var index = 0;
    const { ancestorOptions, dropDownList } = this.state;
    ancestorOptions.forEach((categoryOptions, i) => {
      matchingObj = categoryOptions.find(cat => cat.name === value);
      if (matchingObj) {
        objCategory = matchingObj;
        index = i;
      }
    });

    if (objCategory) {
      for (let i = 0; i < dropDownList.length; i++) {
        if (i > index) {
          dropDownList[i] = null;
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

  createSizesOptions = () => {
    let sizeOptions = [];
    const { sizes } = this.props;
    if (sizes && sizes.length > 0) {
      sizes.forEach(size => {
        sizeOptions.push({
          key: size.id,
          text: size.size_type,
          value: size.size_type
        });
      });
    }
    this.setState({ sizeOptions });
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

  addItemSizes = event => {
    event.preventDefault();
    this.setState(prevState => ({
      item_sizes_attributes: [
        ...prevState.item_sizes_attributes,
        {
          code: "",
          discount: 0,
          quantity: 0,
          price: 0,
          size_attributes: { size_type: "" }
        }
      ]
    }));
  };

  removeItemSizes = event => {
    event.preventDefault();
    let item_sizes_attributes = [...this.state.item_sizes_attributes];
    item_sizes_attributes.splice(-1, 1);
    this.setState({ item_sizes_attributes });
  };

  componentDidMount() {
    if (this.props.itemData) {
      this.setDefaultState(this.props.itemData);
    }
  }

  render() {
    const {
      open,
      display,
      dropDownList,
      name,
      item_sizes_attributes,
      sizeOptions
    } = this.state;

    const { itemData } = this.props;

    return (
      <React.Fragment>
        {itemData && (
          <Button color="green" icon="edit" onClick={() => this.show("edit")} />
        )}
        <div className="item">
          {!itemData && (
            <Button id="addItem" onClick={() => this.show("add")} primary>
              Add item
            </Button>
          )}
          <Modal
            className="cat-modal"
            dimmer="blurring"
            open={open}
            onClose={itemData ? this.cancel : this.close}
          >
            <Modal.Header>{itemData ? "Edit Item" : "Add Item"}</Modal.Header>
            <Form className="itemForm">
              <Form.Group widths="2">
                <Form.Input
                  fluid
                  label="Name"
                  placeholder="Item name"
                  name="name"
                  onChange={this.onChange}
                  value={name}
                  required
                />

                <Form.Field required>
                  <label>Category</label>
                  {dropDownList.map(data => data)}
                </Form.Field>
              </Form.Group>

              {item_sizes_attributes.map((item, index) => {
                return (
                  <Form.Group widths="5" key={index}>
                    <Form.Input
                      fluid
                      label="Code"
                      placeholder="Item code"
                      name="code"
                      id={"code-" + index}
                      onChange={this.onChange}
                      value={item_sizes_attributes[index][name]}
                      required
                    />
                    <Form.Field required>
                      <label>Size</label>
                      <Dropdown
                        placeholder="Size"
                        name="size_type"
                        id={"size-" + index}
                        fluid
                        value={
                          item_sizes_attributes[index]["size_attributes"][name]
                        }
                        clearable
                        options={sizeOptions}
                        onChange={event => this.handleSizeChange(event, index)}
                        selection
                      />
                    </Form.Field>
                    <Form.Input
                      fluid
                      label="Price"
                      placeholder="Item price"
                      type="number"
                      name="price"
                      id={"price-" + index}
                      value={item_sizes_attributes[index][name]}
                      onChange={this.onChange}
                      required
                    />

                    <Form.Input
                      fluid
                      label="Quantity"
                      type="number"
                      placeholder="Item quantity"
                      name="quantity"
                      id={"quantity-" + index}
                      value={item_sizes_attributes[index][name]}
                      onChange={this.onChange}
                      required
                    />

                    <Form.Field>
                      <Form.Input
                        fluid
                        type="number"
                        label="Discount( % )"
                        placeholder="Discount"
                        name="discount"
                        id={"discount-" + index}
                        value={item_sizes_attributes[index]["name"]}
                        min="0"
                        max="100"
                        onChange={this.onChange}
                      ></Form.Input>
                    </Form.Field>
                  </Form.Group>
                );
              })}

              <Button color="green" onClick={this.addItemSizes}>
                Add more Size
              </Button>

              {item_sizes_attributes.length > 1 ? (
                <Button color="red" onClick={this.removeItemSizes}>
                  Remove Size
                </Button>
              ) : null}

              {display ? (
                <Message negative>
                  <Message.Header>fields can not be empty</Message.Header>
                  <p>
                    check the fields with red-star, these should not be empty{" "}
                  </p>
                </Message>
              ) : null}
            </Form>

            <Modal.Actions>
              <Button
                color="black"
                onClick={
                  itemData
                    ? () => this.cancel("edit")
                    : () => this.cancel("add")
                }
              >
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
