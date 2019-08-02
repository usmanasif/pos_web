import React, { Component } from "react";
import SignIn from "./signIn";
import {
  Container,
  Grid,
  Header,
  Icon,
  Segment,
  Label
} from "semantic-ui-react";

class AdminAuth extends Component {
  render() {
    return (
      <Container className="marginTop" textAlign="justified">
        <Grid centered columns={2}>
          <Grid.Column>
            <Segment color="blue">
              <Label ribbon color="blue">
                <h3>Wellcome to DESINC POS</h3>
              </Label>
              <Header>
                <h1>
                  <Icon name="sign in" />
                  Admin Login
                </h1>
              </Header>
              <SignIn {...this.props} />
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default AdminAuth;
