import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/app/App";
import configureStore from "./redux/configure-store";
import { verifyCredentials } from "./redux/redux-token-auth-config"; // <-- note this is YOUR file, not the redux-token-auth NPM module
import "semantic-ui-css/semantic.min.css";

const store = configureStore();
var r = verifyCredentials(store);
console.log(r);

if (r) {
  r.then(resp => {
    // this is not working properly
    console.log("Logged In");
  });
} else {
  console.log("Logged Out");
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
