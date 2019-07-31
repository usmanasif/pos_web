import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

export default function configureStore() {
  const middleware = applyMiddleware(thunk);
  const store = createStore(
    rootReducer,
    compose(
      middleware,
      window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f
    )
  );
  return store;
}
