import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';


export default function configureStore(){
  const middleware = applyMiddleware(thunk);
  const store = createStore(rootReducer, middleware);
  return store;
}
