import React, { Component } from "react";
import Chart from "react-apexcharts";
import { apiUrl } from "../../utils/api-config";
import http from "../../services/httpService";
import { cahrtColors } from "../../utils/chartsData";
class LastWeekSalesChart extends Component {
  state = {
    options: {
      colors: cahrtColors,
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    },
    series: []
  };
  componentDidMount() {
    http
      .get(`${apiUrl}/api/v1/invoices?last_week_sales=true`)
      .then(({ data }) => {
        const options = { ...this.state.options };
        const values = data.results.map(({ total }) => parseFloat(total));
        options.labels = data.results.map(({ created_at }) => {
          let label = new Intl.DateTimeFormat("en-PK", {
            year: "numeric",
            month: "short",
            day: "numeric"
          }).format(new Date(created_at));
          return label;
        });
        this.setState({ options, series: values });
      })
      .catch(error => console.log(error));
  }
  render() {
    return (
      <Chart
        options={this.state.options}
        series={[{ name: "Daily Sales", data: [...this.state.series] }]}
        type="bar"
        width="100%"
        height="300px"
      />
    );
  }
}

export default LastWeekSalesChart;
