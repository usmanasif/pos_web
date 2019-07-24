import React, { Component } from "react";
import { connect } from "react-redux";
import { signInUser } from "../redux-token-auth-config";
import { Form, Button } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      redirect: false
    };

    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  submitForm = e => {
    e.preventDefault();
    const { signInUser } = this.props;
    const { email, password } = this.state;
    signInUser({ email, password })
      .then(resp => {
        console.log("Logged In now.");
        let redirect = this.state.redirect;
        redirect = true;
        this.setState({ redirect });
      })
      .catch(error => {
        console.log("error is", error);
      });
  };

  render() {
    const { submitForm } = this;
    return (
      <React.Fragment>
        {this.state.redirect && <Redirect to="/logout" />}
        <Form onSubmit={submitForm}>
          <Form.Input
            icon="at"
            iconPosition="left"
            placeholder="Enter your email"
            type="text"
            name="email"
            onChange={this.onChange}
            value={this.state.email}
          />
          <Form.Input
            icon="key"
            iconPosition="left"
            placeholder="Enter Password"
            type="password"
            name="password"
            onChange={this.onChange}
            value={this.state.password}
          />

          <Button
            basic
            color="blue"
            content="Login"
            icon="sign in"
            labelPosition="left"
          />
        </Form>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { signInUser }
)(SignInScreen);
