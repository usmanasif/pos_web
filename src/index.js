import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./components/app/App";
import configureStore from "./redux/configure-store";
import { verifyCredentials } from "./redux/redux-token-auth-config"; // <-- note this is YOUR file, not the redux-token-auth NPM module
import "semantic-ui-css/semantic.min.css";

const store = configureStore();
verifyCredentials(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
