import _ from 'lodash';
import React, { Component } from 'react';
import { Table, Input, Form, Button, Grid } from 'semantic-ui-react';
import AddItem from './addItem';
import Axios from 'axios';
import {apiUrl} from "../../utils/api-config";
import AddCategory from '../category/addCategory';
import Paginate from './pagination';
import CategorySideBar from '../category/categorySideBar';

function searchingFor(item) {
    return function (x) {
        return (
            x.name.toLowerCase().includes(item.toLowerCase()) 
        );
    }
}

export default class Inventory extends Component {
    state = {
        column: null,
        data: [],
        apiResponse:[],
        direction: null,
        item: ''
    }

    nextCategoryChild =(obj)=>{
        if(obj.children.length>0)
            this.checkCategoryTree(obj.children);
        else
            this.state.data.push(obj);
    }

    checkCategoryTree = (arrayOfObj) =>{
        arrayOfObj.map(obj =>{
            this.nextCategoryChild(obj);
        });
    }
    fetchCategoriesData = () =>{
        let handler =this;
        Axios.get(apiUrl+"/api/v1/categories") 
        .then(function (response) {
            handler.setState({
                data:response.data,
                apiResponse:response.data
            });
            handler.checkCategoryTree(handler.state.data);
        })
        .catch(function (error) {
        });
    }   

    searchHandler = (e) => {
        this.setState({ item: e.target.value })
    }

    handleSort = clickedColumn => () => {
        const { column, data, direction } = this.state
        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                data: _.sortBy(data, [clickedColumn]),
                direction: 'ascending',
            })
            return
        }
        this.setState({
            data: data.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }
    
    deleteItem = (index) =>{
        const copyData = Object.assign([], this.state.data);
        copyData.splice(index,1);
        this.setState({
            data: copyData
        });
    }

    editItem = (obj) =>{
        const copyData = Object.assign([], this.state.data);
        var foundIndex = copyData.findIndex(x => x.id == obj.id);
        copyData[foundIndex] = obj;

        this.setState({
            data: copyData
        });
    }

    addItem = (obj) =>{
        const copyData = Object.assign([], this.state.data);
        copyData.push(obj);

        this.setState({
            data: copyData
        });
    }

    componentDidMount(){
        this.fetchCategoriesData();
    }
      
    render() {
        const { column, data, direction,apiResponse } = this.state;
        return (
            <div>
                <Grid>
                    <Grid.Column width={4}>
                        <CategorySideBar></CategorySideBar>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Form>
                            <Input icon='search' placeholder='Search...' onChange={this.searchHandler} />
                            <AddItem addItem={this.addItem}></AddItem>
                            <AddCategory data={apiResponse}></AddCategory>

                        </Form>
                        <Table sortable celled fixed>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell
                                        sorted={column === 'name' ? direction : null}
                                        onClick={this.handleSort('name')}
                                    >
                                        Name
                            </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={column === 'quantity' ? direction : null}
                                        onClick={this.handleSort('quantity')}
                                    >
                                        Quantity
                            </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={column === 'category' ? direction : null}
                                        onClick={this.handleSort('category')}
                                    >
                                        Category
                            </Table.HeaderCell>
                                    <Table.HeaderCell
                                        sorted={column === 'price' ? direction : null}
                                        onClick={this.handleSort('price')}
                                    >
                                        Price
                            </Table.HeaderCell>
                                    <Table.HeaderCell>
                                        Actions
                            </Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {data.filter(searchingFor(this.state.item)).map((data, index)=>
                                    <Table.Row key={data.name}>
                                        <Table.Cell>{data.name}</Table.Cell>
                                        <Table.Cell>{data.quantity}</Table.Cell>
                                        <Table.Cell>{data.name}</Table.Cell>
                                        <Table.Cell>{data.price}</Table.Cell>
                                        <Table.Cell>
                                            <Button color='red' icon='delete' onClick={() => this.deleteItem(index)}></Button>
                                            <AddItem itemData={data} editItem={this.editItem}></AddItem>
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                        <Paginate></Paginate>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}