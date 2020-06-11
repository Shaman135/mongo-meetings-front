import { User } from "./user";

export enum AuthActionType {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  SET_LOADING = "SET_LOADING",
  INITIALIZE = "INITIALIZE"
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  ready: boolean;
}

export interface AuthAction {
  type: string;
  payload: AuthState;
}

export type AuthDispatch = (action: AuthAction) => AuthState;

export interface AuthContextProps {
  state: AuthState;
  dispatch: any;
}
