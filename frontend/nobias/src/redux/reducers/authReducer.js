import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  SET_PROFILE,
  SET_LOADING,
  SET_ERROR,
} from "../types";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    case SET_PROFILE:
      return {
        ...state,
        isAuthenticated: true,
        user: {
          ...state.user,
          ...action.payload.user,
          profileCompleted: true,
        },
        token: action.payload.token || state.token,
        loading: false,
        error: null,
      };
    case "SET_USER":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token || state.token,
        loading: false,
        error: null,
      };
    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case LOGIN_FAIL:
    case REGISTER_FAIL:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: action.payload,
      };
    case LOGOUT:
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
