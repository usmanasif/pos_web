import _ from "lodash";
import React, { Component } from "react";
import {
  Table,
  Input,
  Form,
  Button,
  Grid,
  Modal,
  Header,
  Container,
  Image
} from "semantic-ui-react";
import AddItem from "./addItem";
import http from "../../services/httpService";
import { apiUrl } from "../../utils/api-config";
import AddCategory from "../category/addCategory";
import Paginate from "./pagination";
import CategorySideBar from "../category/categorySideBar";
import Barcode from 'react-barcode';
import Loader from '../Loader/loader'

const initialPagination = {
  activePage: 1,
  totalPages: 0,
  per_page: 6
};

export default class Inventory extends Component {
  state = {
    ...initialPagination,
    open: false,
    column: null,
    categoryID: null,
    categoryName:"",
    direction: null,
    item: "",
    data: [],
    isLoading:true,
    apiResponse: [],
    newCategories: []
  };

  close = () => {
    this.setState({
      open: false
    });
  };

  show = () => {
    this.setState({
      open: true
    });
  };

  nextCategoryChild = obj => {
    if (obj.children.length > 0) this.checkCategoryTree(obj.children);
  };

  checkCategoryTree = arrayOfObj => {
    arrayOfObj.forEach(obj => {
      this.nextCategoryChild(obj);
    });
  };

  fetchCategoriesData = () => {
    let handler = this;
    http
      .get(apiUrl + "/api/v1/categories")
      .then(function(response) {
        handler.setState({
          apiResponse: response.data,
          newCategories: response.data
        });
        handler.checkCategoryTree(handler.state.data);
      })
      .catch(function(error) {});
  };

  searchHandler = e => {
    this.setState({ item: e.target.value },() => {
      const {per_page,categoryID, item }=this.state;      
      http
          .get(`${apiUrl}/api/v1/items`, { params: { page:1, per_page, category_id:categoryID,  item} })
          .then(res => {
            this.setState({
              data: res.data[1],
              totalPages: res.data[0].total
            });          
          })
          .catch(error => console.log("Error : ", error));
    });
  };
  
  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state;
    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: "ascending"
      });
      return;
    }
    this.setState({
      data: data.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending"
    });
  };

  pageHandler = () => {
    const { activePage, per_page } = this.state;
    this.handlePagination(activePage, per_page);
  };

  handlePagination = (page, per_page) => {
    this.setState({ activePage: page, per_page: per_page });

    if (this.state.categoryID) {
      this.filterItems(this.state.categoryID);
    } else {
      http
        .get(`${apiUrl}/api/v1/items`, { params: { page, per_page } })
        .then(res => {
          this.setState({
            data: res.data[1],
            totalPages: res.data[0].total,
            isLoading:false
          });
        })
        .catch(error => console.log("Error : ", error));

      this.setState({ state: this.state });
    }
  };

  confirmDelete = item => {
    this.deleteItem(item.id);
  };

  deleteItem = id => {
    http
      .delete(`${apiUrl}/api/v1/items/${id}`)
      .then(res => {
        this.pageHandler();
      })
      .catch(error => console.log("Error: ", error));

    this.close();
  };

  filterItems = (cat_name, cat_id) => {
    this.setState({
      categoryName:cat_name,      
      categoryID: cat_id 
    });

    http
      .get(`${apiUrl}/api/v1/items`, { params: { category_id: cat_id } })
      .then(res => {
        const itemData = res.data[1];
        const count = res.data[0].total;
        this.setState({
          data: itemData,
          totalPages: count,
        });
      })
      .catch(error => console.log("Error: ", error));
  };

  filterCategory = category => {
    this.setState({
      newCategories: category.children,
      categoryName: category.name
    });
  };

  editItem = () => {
    this.pageHandler();
  };
  addItem = () => {
    this.pageHandler();
  };

  addCategory = () => this.fetchCategoriesData();

  gotoHome = () => {
    this.componentDidMount();
  };

  componentDidMount() {
    this.fetchCategoriesData();
    this.state.categoryID = null;
    this.state.categoryName="";
    this.setState({
      activePage: 1
    });

    const { per_page } = this.state;
    this.handlePagination(1, per_page);
  }

  render() {
    const {
      column,
      isLoading,
      data,
      direction,
      apiResponse,
      activePage,
      totalPages,
      per_page,
      newCategories,
      categoryName
    } = this.state;

    return (
      <div>
        <Container className="page-header">
          <Header as="h2" className="second-header" floated="right">
            Devsinc
          </Header>
          <Header as="h2" floated="left">
            <Image className="logo" src={require("../../images/logo.png")} />
            <span className="header-text">Item Inventory</span>
          </Header>
        </Container>
        <div className="ui divider"></div>
        <Grid>
          <Grid.Column width={4}>
            <CategorySideBar
              gotoHome={this.gotoHome}
              filterItems={this.filterItems}
              filterCategory={this.filterCategory}
              data={newCategories}
            />
          </Grid.Column>
          <Grid.Column width={12}>
            <Form>
              <Input
                icon='search'
                placeholder={categoryName?'search items in '+ categoryName:'search items'}
                onChange={this.searchHandler} 
              />
              {apiResponse.length > 0 && this.props.role === "read_and_write" ? (
                <AddItem addItem={this.addItem} data={apiResponse} />
              ) : null}
              {this.props.role === "read_and_write" && 
                <AddCategory addCategory={this.addCategory} data={apiResponse} />}
            </Form>
            <Table sortable celled fixed>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    sorted={column === "name" ? direction : null}
                    onClick={this.handleSort("name")}
                  >
                    Name
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === "quantity" ? direction : null}
                    onClick={this.handleSort("quantity")}
                  >
                    Quantity
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === "code" ? direction : null}
                    onClick={this.handleSort("code")}
                  >
                    QR Code
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === "category" ? direction : null}
                    onClick={this.handleSort("category")}
                  >
                    Category
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === "price" ? direction : null}
                    onClick={this.handleSort("price")}
                  >
                    Price
                  </Table.HeaderCell>
                  <Table.HeaderCell>Actions</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {!isLoading?data.map(d => (
                  <Table.Row key={d.id}>
                    <Table.Cell>{d.name}</Table.Cell>
                    <Table.Cell>{d.current_stock}</Table.Cell>
                    <Table.Cell className='barcode'><Barcode value={d.code} /></Table.Cell>
                    <Table.Cell>{d.category.name}</Table.Cell>
                    <Table.Cell>{d.sale_price}</Table.Cell>
                    <Table.Cell>
                      <Modal
                        dimmer="inverted"
                        trigger={
                          <Button
                            basic
                            color="red"
                            icon="trash alternate outline"
                          />
                        }
                        basic
                        size="tiny"
                        header={
                          <Header
                            icon="trash alternate outline"
                            content="Are you Sure"
                          />
                        }
                        actions={[{ key: "ok", content: "Ok", positive: true, onClick:() => this.confirmDelete(d) }]}
                        onClose={this.close}
                      />
                      <AddItem
                        itemData={d}
                        editItem={this.editItem}
                        data={apiResponse}
                      />
                    </Table.Cell>
                  </Table.Row>
                )):<Loader />
                }
              </Table.Body>
            </Table>
            {totalPages > 0 ? (
              <Paginate
                handlePagination={this.handlePagination}
                pageSet={{ activePage, totalPages, per_page, data }}
              />
            ) : <h1 className="items-record">No Record Found</h1>}
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
