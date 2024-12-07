// store.js
import { createStore, combineReducers } from 'redux';
import Reducer from './reducers';

const rootReducer = combineReducers({
  store: Reducer,
  auth: Reducer,
});

const store = createStore(rootReducer);

export default store;
