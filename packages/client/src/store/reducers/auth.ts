import { Action, ActionType } from "../actions/types";

export interface AuthState {
  token: string | null;
  isAuthenticated: boolean | null;
  loading: boolean;
  user: string | null;
}
const initialState: AuthState = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export default function (state: AuthState = initialState, action: Action) {
  const { type, payload } = action;

  switch (type) {
    case ActionType.REGISTER_SUCCESS:
    case ActionType.LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };
    case ActionType.REGISTER_FAIL:
    case ActionType.LOGIN_FAIL:
    case ActionType.AUTH_ERROR:
    case ActionType.LOGOUT:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      };
    case ActionType.USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };

    default:
      return state;
  }
}
