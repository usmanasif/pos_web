import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { signOutUser } from "../../redux/redux-token-auth-config";
import { ToastContainer } from "react-toastify";
import SignUp from "../authentication/signUp";
import SignIn from "../authentication/signIn";
import SignOut from "../authentication/signOut";
import { Container } from "semantic-ui-react";
import Auth from "../authentication/auth";
import Home from "../company/home";
import Navigation from "../company/navigation";
import CreateCompany from "../company/createCompany";
import AdminApp from "../admin/adminApp";
import { apiSubDomain, pathName } from "../../utils/api-config";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Inventory from "../inventory/inventory";

function App({ isSignedIn, isLoading, signOutUser, isSuperAdmin }) {
  if (isLoading) {
    return (
      <img className="loading_img" src="./images/cart.gif" alt="Loading...." />
    );
  } else if (apiSubDomain === "www" || pathName === "/admin") {
    if (isSignedIn && !isSuperAdmin) {
      signOutUser();
    }
    return <AdminApp />;
  }
  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <div>{isSignedIn && <Navigation />}</div>
        <Container className="marginTop" textAlign="justified">
          <Switch>
            <Route path="/home" exact component={isSignedIn ? Home : Auth} />
            <Route path="/company/create" exact component={isSignedIn ? CreateCompany : Auth} />
            <Route path="/inventory" exact component={Inventory} />
            <Route path="/register" component={SignUp} />
            <Route path="/login" component={SignIn} />
            <Route path="/logout" component={SignOut} />
            <Route path="/" exact component={isSignedIn ? Home : Auth} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

function mapStateToProps(state) {
  const {
    isSignedIn,
    isLoading,
    attributes
  } = state.reduxTokenAuth.currentUser;
  const { isSuperAdmin } = attributes;
  return { isSignedIn, isLoading, isSuperAdmin };
}

export default connect(
  mapStateToProps,
  { signOutUser }
)(App);
