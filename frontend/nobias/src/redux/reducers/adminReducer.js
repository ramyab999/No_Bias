import {
  FETCH_DISCRIMINATION_TYPES,
  FETCH_LOCALIZATIONS,
  FETCH_GENDER_TYPES,
  FETCH_REPORTS,
  FETCH_USERS,
  ADMIN_ERROR,
} from "../types";

const initialState = {
  discriminationTypes: [],
  localizations: [],
  genderTypes: [],
  reports: [],
  users: [],
  error: null,
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_DISCRIMINATION_TYPES:
      return { ...state, discriminationTypes: action.payload, error: null };
    case FETCH_LOCALIZATIONS:
      return { ...state, localizations: action.payload, error: null };
    case FETCH_GENDER_TYPES:
      return { ...state, genderTypes: action.payload, error: null };
    case FETCH_REPORTS:
      return { ...state, reports: action.payload, error: null };
    case FETCH_USERS:
      return { ...state, users: action.payload, error: null };
    case ADMIN_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export default adminReducer;
