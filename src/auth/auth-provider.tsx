import React from "react";
import { AuthContextProps, AuthState } from "../models/auth-models";
import { authReducer } from "./auth-reducer";

export const authInitialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  ready: false,
};

export const authInitialProps = {
  state: authInitialState,
  dispatch: (): void => {},
};

export const AuthContext = React.createContext<AuthContextProps>(
  authInitialProps
);

interface AuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, dispatch] = React.useReducer(authReducer, authInitialState);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
