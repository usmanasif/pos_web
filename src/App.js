import React from 'react';
import logo from './logo.svg';
import './App.css';
import RegisterScreen from './components/RegisterScreen'
import SignInScreen from './components/SignInScreen'
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" exact component={SignInScreen} />
        <Route path="/signup" exact component={RegisterScreen} />
      </div>
    </Router>

  );
}

export default App;
