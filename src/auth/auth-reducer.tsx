import { AuthState, AuthAction, AuthActionType } from "../models/auth-models";

export const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case AuthActionType.INITIALIZE:
      const userStr = localStorage.getItem("user");
      const tokenStr = localStorage.getItem("token");
      if (userStr && tokenStr) {
        return {
          ...state,
          isAuthenticated: true,
          user: JSON.parse(userStr),
          token: JSON.parse(tokenStr),
          ready: true,
        };
      }
      return {
        ...state,
        ready: true,
      };
    case AuthActionType.SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading,
      };
    case AuthActionType.LOGIN:
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        ready: true,
      };
    case AuthActionType.LOGOUT:
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};
