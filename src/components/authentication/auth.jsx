import React from "react";
import SignUp from "./signUp";
import SignIn from "./signIn";
import { Divider, Grid, Header, Icon, Segment, Label } from "semantic-ui-react";
const HomePage = props => {
  return (
    <Segment color="blue">
      <Grid columns={2} relaxed="very">
        <Divider vertical>Or</Divider>
        <Grid.Row verticalAlign="middle">
          <Grid.Column>
            <Label ribbon color="blue"> First time here? </Label>
            <Header>
              <h1>
                <Icon name="signup" />
                Register
              </h1>
            </Header>
            <SignUp {...props} />
          </Grid.Column>
          <Grid.Column>
            <Label ribbon="right" color="blue">
              Already have an Account?
            </Label>
            <Header>
              <h1>
                <Icon name="sign in" />
                Login
              </h1>
            </Header>
            <SignIn {...props} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default HomePage;
