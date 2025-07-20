import { createStore, applyMiddleware } from "redux";
import { thunk } from "redux-thunk"; // Fix here
import rootReducer from "./reducers";

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
