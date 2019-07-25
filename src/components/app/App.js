import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignUp from "../authentication/signUp";
import SignIn from "../authentication/signIn";
import SignOut from "../authentication/signOut";
import { Container } from "semantic-ui-react";
import Auth from "../authentication/auth";
import Header from "../navbar/header";
import Home from "../company/home"
import "./App.css";
function App() {
  return (
    <Router>
      <div className="App">
        <Container className="marginTop" textAlign="justified">
          <Header />
          <Switch>
            <Route path="/" exact component={Auth} />
            <Route path="/company" exact component={Home} />
            <Route path="/register" component={SignUp} />
            <Route path="/login" component={SignIn} />
            <Route path="/logout" component={SignOut} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;
