import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import configureStore from "./redux/configure-store";
import { verifyCredentials } from "./redux-token-auth-config"; // <-- note this is YOUR file, not the redux-token-auth NPM module
import "semantic-ui-css/semantic.min.css";

const store = configureStore();
var r = verifyCredentials(store);
console.log(r);

if (r) {
  r.then(resp => {
    console.log("Logged In");
  });
} else {
  console.log("Logged Out");
}

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
