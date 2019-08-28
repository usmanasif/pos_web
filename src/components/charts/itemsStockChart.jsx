import React, { Component } from "react";
import Chart from "react-apexcharts";
import { apiUrl } from "../../utils/api-config";
import http from "../../services/httpService";
class ItemsStockChart extends Component {
  state = {
    options: {
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      labels: []
    },
    series: [
      {
        name: "Available stock",
        data: []
      }
    ]
  };

  componentDidMount() {
    http
      .get(`${apiUrl}/api/v1/items`)
      .then(({ data }) => {
        const options = { ...this.state.options };
        const series = [...this.state.series];
        series[0].data = data[1].map(({ current_stock }) =>
          parseFloat(current_stock)
        );
        options.labels = data[1].map(({ name }) => name);
        this.setState({ options, series });
      })
      .catch(error => console.log(error));
  }
  render() {
    return (
      <Chart
        options={this.state.options}
        series={this.state.series}
        type="bar"
        height="auto"
      />
    );
  }
}

export default ItemsStockChart;
