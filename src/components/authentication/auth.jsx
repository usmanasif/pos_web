import React, { Component } from "react";
import { connect } from "react-redux";
import SignUp from "./signUp";
import SignIn from "./signIn";
import { Divider, Grid, Header, Icon, Segment, Label } from "semantic-ui-react";

class Auth extends Component {
  render() {
    const { isLoading } = this.props;
    if (isLoading) {
      return null;
    }
    return (
      <Segment color="blue">
        <Grid columns={2} relaxed="very">
          <Divider vertical>Or</Divider>
          <Grid.Row verticalAlign="middle">
            <Grid.Column>
              <Label ribbon color="blue">
                First time here?
              </Label>
              <Header>
                <h1>
                  <Icon name="signup" />
                  Register
                </h1>
              </Header>
              <SignUp {...this.props} />
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
              <SignIn {...this.props} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
}

function mapStateToProps(state) {
  const { isLoading } = state.reduxTokenAuth.currentUser;
  return { isLoading };
}

export default connect(mapStateToProps)(Auth);
