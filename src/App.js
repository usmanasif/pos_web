import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import RegisterScreen from "./components/RegisterScreen";
import SignInScreen from "./components/SignInScreen";
import SiteHeader from "./components/SiteHeader";
import { Container } from "semantic-ui-react";
import HomePage from "./components/homePage";
import PageHeader from "./components/header";
import "./App.css";
function App() {
  return (
    <Router>
      <div className="App">
        <Container className="marginTop" textAlign="justified">
          <PageHeader />
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/register" component={RegisterScreen} />
            <Route path="/login" component={SignInScreen} />
            <Route path="/logout" component={SiteHeader} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;
