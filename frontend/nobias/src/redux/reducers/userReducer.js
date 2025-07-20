const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        isAuthenticated:
          action.payload.isAuthenticated !== undefined
            ? action.payload.isAuthenticated
            : true,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "LOGOUT_USER":
      return initialState;
    default:
      return state;
  }
};

export default authReducer;
