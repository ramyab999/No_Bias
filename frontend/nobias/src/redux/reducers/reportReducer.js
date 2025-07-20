import { SUBMIT_REPORT, FETCH_USER_REPORTS, REPORT_ERROR } from "../types";

const initialState = {
  userReports: [],
  success: false,
  error: null,
};

const reportReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBMIT_REPORT:
      return {
        ...state,
        userReports: [...state.userReports, action.payload],
        success: true,
        error: null,
      };
    case FETCH_USER_REPORTS:
      return { ...state, userReports: action.payload, error: null };
    case REPORT_ERROR:
      return { ...state, error: action.payload, success: false };
    default:
      return state;
  }
};

export default reportReducer;
