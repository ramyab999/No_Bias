import { combineReducers } from "redux";
import authReducer from "./authReducer";
import adminReducer from "./adminReducer";
import userReducer from "./userReducer";
import reportReducer from "./reportReducer";
import "bootstrap/dist/css/bootstrap.min.css";

const rootReducer = combineReducers({
  auth: authReducer,
  admin: adminReducer,
  user: userReducer,
  reports: reportReducer,
});

export default rootReducer;
