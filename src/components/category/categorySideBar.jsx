import React, { Component } from "react";
import { Accordion } from "semantic-ui-react";


export default class categorySideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      activeIndex:0
    };
  }

  handleActiveIndex = (title) =>{
    // debugger
    const { index } = title
    // const { activeIndex } = this.state
    // const newIndex = activeIndex === index ? -1 : index

    // this.setState({ activeIndex: newIndex })
  }

  handleClick = id => (event, itemProps) =>  {
    console.log(id);
    this.handleActiveIndex(itemProps);   
    // this.props.filterItems(id);
  }

  generateAccordion = (children,  id) => {
    return (
      <div>
        {children.length > 0 ? (    
          <Accordion.Accordion panels={this.createPanel(children)}  onTitleClick={this.handleClick(id)}/>
        ) : null}
      </div>
    );
  };

  createPanel = options => {
    let penalArray = [];
    if (options.length > 0) {
      options.map((data) => {
        penalArray.push({
          key: data.id,
          title: `${data.id} ${data.name}`,
          content: { content: this.generateAccordion(data.children, data.id) },
         
        });
      });
    }
    return penalArray;
  };
   
  render() {
    this.state.data = this.props.data;
    const { activeIndex } = this.state

    return (
      <div>
        <label>
          <strong>All Categories</strong>
        </label>
        <Accordion
          activeIndex={activeIndex}
          panels={this.createPanel(this.state.data)}
          styled
        />
      </div>
    );
  }
}
