import React, { Component } from "react";
import { connect } from "react-redux";
import { signOutUser } from "../../redux/redux-token-auth-config";
import { Button } from "semantic-ui-react";
class SiteHeader extends Component {
  signOut = e => {
    e.preventDefault();
    const { signOutUser } = this.props;
    signOutUser() // <-<-<-<-<- here's the important part <-<-<-<-<-
      .then(res => console.log("user Logged out.....  ", SiteHeader))
      .catch(err => console.log(err));
  };

  render() {
    const { signOut } = this;
    if (!localStorage.getItem("access-token")) {
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

export default connect(
  null,
  { signOutUser }
)(SiteHeader);
