import React, { Component } from "react";
import Chart from "react-apexcharts";
import { apiUrl } from "../../utils/api-config";
import { cahrtColors } from "../../utils/chartsData";
import http from "../../services/httpService";
class SalesByCategoryChart extends Component {
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
      .get(`${apiUrl}/api/v1/items?sales_by_category=true`)
      .then(({ data }) => {
        const options = { ...this.state.options };
        const values = Object.values(data.results).map(Number);
        options.labels = Object.keys(data.results);
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

export default SalesByCategoryChart;
