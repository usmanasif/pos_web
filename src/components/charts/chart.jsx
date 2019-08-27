import React, { Component } from "react";
import { Bar, Pie, Doughnut, Line } from "react-chartjs-2";
import http from "../../services/httpService";
import { apiUrl } from "../../utils/api-config";
import { Grid } from "semantic-ui-react";

class Chart extends Component {
  state = {
    chartData: {
      labels: [],
      datasets: [
        {
          label: "Daily Sales Rs",
          data: [],
          backgroundColor: [
            "rgba(255, 99, 132, 0.8)",
            "rgba(54, 162, 235, 0.8)",
            "rgba(255, 206, 86, 0.8)",
            "rgba(75, 192, 192, 0.8)",
            "rgba(153, 102, 255, 0.8)",
            "rgba(255, 159, 64, 0.8)",
            "rgba(255, 99, 132, 0.8)"
          ]
        }
      ]
    }
  };

  componentDidMount() {
    http
      .get(`${apiUrl}/api/v1/invoices?last_week_sales=true`)
      .then(({ data }) => {
        const chartData = { ...this.state.chartData };
        chartData.datasets[0].data = data.results.map(({ total }) => total);
        chartData.labels = data.results.map(({ created_at }) => {
          let label = new Intl.DateTimeFormat("en-PK", {
            year: "numeric",
            month: "long",
            day: "numeric"
          }).format(new Date(created_at));
          return label;
        });
        this.setState({ chartData });
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
              <Bar
                data={this.state.chartData}
                options={{
                  title: {
                    display: this.state.displayTitle,
                    text: "Largest Cities In " + this.props.location,
                    fontSize: 25
                  },
                  legend: {
                    display: this.state.displayLegend,
                    position: this.state.legendPosition
                  }
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="8">
              <Pie
                data={this.state.chartData}
                options={{
                  title: {
                    display: this.state.displayTitle,
                    text: "Largest Cities In " + this.props.location,
                    fontSize: 25
                  },
                  legend: {
                    display: this.state.displayLegend,
                    position: this.state.legendPosition
                  }
                }}
              />
            </Grid.Column>
            <Grid.Column width="8">
              <Doughnut
                data={this.state.chartData}
                options={{
                  title: {
                    display: this.state.displayTitle,
                    text: "Largest Cities In " + this.props.location,
                    fontSize: 25
                  },
                  legend: {
                    display: this.state.displayLegend,
                    position: this.state.legendPosition
                  }
                }}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width="8">
              <Line
                data={this.state.chartData}
                options={{
                  title: {
                    display: this.state.displayTitle,
                    text: "Largest Cities In " + this.props.location,
                    fontSize: 25
                  },
                  legend: {
                    display: this.state.displayLegend,
                    position: this.state.legendPosition
                  },
                  fill: false
                }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Chart;
