import React, { Component } from "react";
import http from "../../services/httpService";
import { apiUrl } from "../../utils/api-config";
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

  fetchCategoriesData = () => {
    let handler = this;
    http
      .get(apiUrl + "/api/v1/categories")
      .then(function(response) {
        handler.setState({
          data: response.data
        });
      })
      .catch(function(error) {});
  };

  componentDidMount() {
    this.fetchCategoriesData();
  }
  render() {
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
