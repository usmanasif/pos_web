import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignUp from "../authentication/signUp";
import SignIn from "../authentication/signIn";
import SiteHeader from "../authentication/signOut";
import { Container } from "semantic-ui-react";
import HomePage from "../home/homePage";
import PageHeader from "../navbar/header";
import Company from "../company/company"
import "./App.css";
function App() {
  return (
    <Router>
      <div className="App">
        <Container className="marginTop" textAlign="justified">
          <PageHeader />
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/company" exact component={Company} />
            <Route path="/register" component={SignUp} />
            <Route path="/login" component={SignIn} />
            <Route path="/logout" component={SiteHeader} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;
