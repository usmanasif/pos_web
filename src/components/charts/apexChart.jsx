import React, { Component } from "react";
import Chart from "react-apexcharts";
import { apiUrl } from "../../utils/api-config";
import http from "../../services/httpService";
import { Grid } from "semantic-ui-react";
class ApexChart extends Component {
  state = {
    options: {
      colors: [
        "rgba(54, 162, 235, 0.8)",
        "rgba(255, 99, 132, 0.8)",
        "rgba(255, 206, 86, 0.8)",
        "rgba(75, 192, 192, 0.8)",
        "rgba(153, 102, 255, 0.8)",
        "rgba(255, 159, 64, 0.8)",
        "rgba(255, 99, 132, 0.8)"
      ],
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
        debugger;
        options.labels = data.results.map(({ created_at }) => {
          let label = new Intl.DateTimeFormat("en-PK", {
            year: "numeric",
            month: "long",
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
      <div>
        <Grid>
          <Grid.Row>
            <Grid.Column width="10">
              <h1>Last Week Sales</h1>
              <Chart
                options={this.state.options}
                series={[{ name: "Daily Sales", data: [...this.state.series] }]}
                type="bar"
                width="100%"
                height="auto"
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="8">
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="pie"
                width="100%"
              />
            </Grid.Column>
            <Grid.Column width="8">
              <Chart
                options={this.state.options}
                series={this.state.series}
                type="donut"
                width="100%"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default ApexChart;
