import React, { Component } from "react";
import {Icon, Table, Header, Button } from "semantic-ui-react";


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
      this.props.filterItems(item.name, item.id)
    
  }

  generateCategoryList = (data) =>{
    let arr =[];
    data.forEach((item)=>{
      arr.push(
       <Table.Row key={item.id} onClick={this.itemClicked(item)} style={{cursor:'pointer'}}>
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
    this.props.gotoHome();
  }
   
  render() {
    
    this.state.data = this.props.data;
    const { data } = this.state

    return (
      <div style={data.length>0?{ marginTop:"6%"}:{ marginTop:"20%"}}>
          {data.length>0?
          <div>
              <Button primary floated='left' onClick={this.gotoHome}>
              <Icon name='left chevron' />
                Home
            </Button>
          </div>
          :null
          }
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
