import React, { Component } from 'react'
import { connect } from 'react-redux'
import { registerUser } from '../redux-token-auth-config' // <-- note this is YOUR file, not the redux-token-auth NPM module

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      firstName: '',
      password: ''
    };

    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  submitForm (e) {
    e.preventDefault()
    const { registerUser } = this.props
    const {
      email,
      firstName,
      password,
    } = this.state;
    registerUser({email, firstName, password}).then((response) => {
      console.log('response', response);
    }).catch((error) => {
      console.log('error is', error);
    });
  }

  render() {
    const { submitForm } = this;
    return (
      <form onSubmit={submitForm}>
        <div>
          <label>Email: </label>
          <br/>
          <input type="text" name="email" onChange={this.onChange} value={this.state.email} />
        </div>

        <br/>

        <div>
          <label>Password: </label>
          <br/>
          <input type="password" name="password" onChange={this.onChange} value={this.state.password} />
        </div>

        <br/>

        <button type="submit">SIGNUP</button>
      </form>
    );
  }

}

export default connect(
  null,
  { registerUser },
)(RegisterScreen);
