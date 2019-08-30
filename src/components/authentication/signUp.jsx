import React, { Component } from "react";
import { connect } from "react-redux";
import { registerUser } from "../../redux/redux-token-auth-config";
import { Form, Button } from "semantic-ui-react";
import { toast } from "react-toastify";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      name: ""
    };
    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  submitForm(e) {
    e.preventDefault();
    const { registerUser } = this.props;
    const { email, name, password } = this.state;
    registerUser({ email, name, password })
      .then(() => {
        this.props.history.push("/home");
      })
      .catch(error => {
        toast(`Error : ${error.response.statusText}`);
        const { errors } = error.response.data;
        Object.keys(errors).map(
          e =>
            e !== "full_messages" &&
            toast.error(`${e.toUpperCase()} ${errors[e]}`, { autoClose: false })
        );
      });
  }

  render() {
    const { submitForm } = this;
    return (
      <React.Fragment>
        <Form onSubmit={submitForm}>
          <Form.Input
            icon="user"
            iconPosition="left"
            placeholder="Enter your name"
            type="text"
            name="name"
            onChange={this.onChange}
            value={this.state.name}
            required
          />
          <Form.Input
            icon="mail"
            iconPosition="left"
            placeholder="Enter your email"
            type="email"
            name="email"
            onChange={this.onChange}
            value={this.state.email}
            required
          />
          <Form.Input
            icon="key"
            iconPosition="left"
            placeholder="Enter Password"
            type="password"
            name="password"
            onChange={this.onChange}
            value={this.state.password}
            minLength="6"
            required
          />
          <Button
            basic
            color="blue"
            content="Register"
            icon="signup"
            labelPosition="left"
          />
        </Form>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { registerUser }
)(SignUp);
