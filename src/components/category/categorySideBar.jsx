import React, { Component } from "react";
import { Accordion } from "semantic-ui-react";

export default class categorySideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  generateAccordion = children => {
    return (
      <div>
        {children.length > 0 ? (
          <Accordion.Accordion panels={this.createPanel(children)} />
        ) : null}
      </div>
    );
  };

  createPanel = options => {
    let penalArray = [];
    if (options.length > 0) {
      options.map(data => {
        penalArray.push({
          key: data.id,
          title: data.name,
          content: { content: this.generateAccordion(data.children) }
        });
      });
    }
    return penalArray;
  };
   
  render() {
    this.state.data = this.props.data;

    return (
      <div>
        <label>
          <strong>All Categories</strong>
        </label>
        <Accordion
          defaultActiveIndex={0}
          panels={this.createPanel(this.state.data)}
          styled
        />
      </div>
    );
  }
}
