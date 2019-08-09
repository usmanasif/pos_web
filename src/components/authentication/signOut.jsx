import React, { Component } from "react";
import { connect } from "react-redux";
import { signOutUser } from "../../redux/redux-token-auth-config";
import { Button } from "semantic-ui-react";
class SignOut extends Component {
  signOut = e => {
    e.preventDefault();
    const { signOutUser } = this.props;
    signOutUser()
      .then(res => console.log("user Logged out.....  ", res))
      .catch(err => console.log(err));
  };

  render() {
    const { signOut } = this;
    if (!this.props.isSignedIn) {
      return null;
    }
    return (
      <div>
        <Button
          basic
          color="blue"
          content="Sign Out"
          icon="log out"
          labelPosition="left"
          onClick={signOut}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isSignedIn } = state.reduxTokenAuth.currentUser;
  return { isSignedIn };
}

export default connect(
  mapStateToProps,
  { signOutUser }
)(SignOut);
