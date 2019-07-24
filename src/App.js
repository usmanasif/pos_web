import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import RegisterScreen from "./components/RegisterScreen";
import SignInScreen from "./components/SignInScreen";
import SiteHeader from "./components/SiteHeader";
import { Container } from "semantic-ui-react";
import HomePage from "./components/homePage";
import PageHeader from "./components/header";
function App() {
  return (
    <Container className="marginTop" textAlign="justified">
      <PageHeader />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/register" component={RegisterScreen} />
        <Route path="/login" component={SignInScreen} />
        <Route path="/logout" component={SiteHeader} />
      </Switch>
    </Container>
  );
}

export default App;
