import React, { Component } from "react";
import Chart from "react-apexcharts";
import { apiUrl } from "../../utils/api-config";
import http from "../../services/httpService";
import { cahrtColors } from "../../utils/chartsData";
class StockByCategoryChart extends Component {
  state = {
    options: {
      legend: {
        position: "right",
        fontSize: "16px"
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                show: true,
                label: "Total"
              }
            }
          }
        }
      },
      tooltip: {
        enabled: false
      },
      colors: cahrtColors,
      dataLabels: {
        formatter: function (val, opts){
          return opts.w.config.series[opts.seriesIndex]
        }
      }
    },
    series: []
  };

  componentDidMount() {
    http
      .get(`${apiUrl}/api/v1/items?stock_by_category=true`)
      .then(({ data }) => {
        const options = { ...this.state.options };
        const values = data.results.map(({ total }) => parseFloat(total));
        options.labels = data.results.map(({ name }) => name);
        this.setState({ options, series: values });
      })
      .catch(error => console.log(error));
  }
  render() {
    return (
      <Chart
        options={this.state.options}
        series={this.state.series}
        type="donut"
        width="100%"
      />
    );
  }
}

export default StockByCategoryChart;
