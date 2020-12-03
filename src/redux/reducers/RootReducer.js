const initialState = {
  token: "",
  user: {},
  config: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case "storeClearTemp":
      return {
        ...initialState,
      };
    case "setToken":
      return {
        ...state,
        token: action.payload,
      };
    case "setUser":
      return {
        ...state,
        user: action.payload,
      };
    case "setConfig":
      return {
        ...state,
        config: action.payload,
      };
    default:
      return state;
  }
};
