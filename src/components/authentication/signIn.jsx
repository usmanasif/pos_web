import React, { Component } from "react";
import { connect } from "react-redux";
import { signInUser } from "../../redux/redux-token-auth-config";
import { Form, Button } from "semantic-ui-react";
class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
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
        //console.log("Logged In now.");
        this.props.history.push("/home");
      })
      .catch(error => {
        //console.log("error is", error);
      });
  };

  render() {
    const { submitForm } = this;
    return (
      <React.Fragment>
        <Form onSubmit={submitForm}>
          <Form.Input
            required
            icon="mail"
            iconPosition="left"
            placeholder="Enter your email"
            type="text"
            name="email"
            onChange={this.onChange}
            value={this.state.email}
          />
          <Form.Input
            required
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
)(SignIn);
