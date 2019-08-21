import React, { Component } from "react";
import {List, Icon, Table, Header, Image } from "semantic-ui-react";


export default class categorySideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  itemClicked = item => (event)=>{
    if(item.children.length>0)
      this.props.filterCategory(item);

    if(item.children.length>=0)
      this.props.filterItems(item.id)
    
  }

  generateCategoryList = (data) =>{
    let arr =[];
    data.map((item)=>{
      arr.push(
       <Table.Row onClick={this.itemClicked(item)} style={{cursor:'pointer'}}>
          <Table.Cell>
            <Header as='h4'>
              <Header.Content as="a" > <Icon name="angle right"></Icon> {item.name}  </Header.Content>
            </Header>
          </Table.Cell>
        </Table.Row>
        )
    })

    return arr;
  }
  gotoHome = () =>{
    window.location.reload();
  }
   
  render() {
    this.state.data = this.props.data
    const {data } = this.state

    return (
      <div style={{ marginTop:"16%"}}>  
          <a href="" onClick={this.gotoHome}>Home</a>
          <hr></hr>
          <Table celled padded >
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Categories</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{this.generateCategoryList(data)}</Table.Body>
        </Table>
      </div>

    )
  }
}
