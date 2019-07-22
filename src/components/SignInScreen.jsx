import React, { Component } from 'react'
import { connect } from 'react-redux'
import { signInUser } from '../redux-token-auth-config' // <-- note this is YOUR file, not the redux-token-auth NPM module

class SignInScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };

    this.onChange = this.onChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }


  submitForm = (e) => {
    e.preventDefault();
    const { signInUser } = this.props;
    const {
      email,
      password
    } = this.state;
    signInUser({email, password}).then((resp) => {
      console.log("Logged In now.");
    }).catch((error) => {
      console.log('error is', error);
    });
  }

  render() {
    const { submitForm } = this;
    return (
      <div>
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

        <button type="submit">LOGIN</button>
      </form>
      </div>
    );
  }
}

export default connect(
  null,
  { signInUser },
)(SignInScreen)
