import axios from "axios";
import { setAlert } from "./alert";
import { Action, ActionType } from "./types";
import setAuthToken from "../../utils/setAuthToken";
import { Dispatch } from "redux";
import { AlertType } from "../../enums";
import { History } from "history";
import { AppDispatch } from "../index";

const apiUrl = process.env.REACT_APP_DEV_MODE ? process.env.REACT_APP_SOCKET_API_DEV : process.env.REACT_APP_SOCKET_API;
const axiosRequestConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const loadUser = () => async (dispatch: Dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get(`${apiUrl}/api/auth`);
    dispatch({ type: ActionType.USER_LOADED, payload: res.data });
  } catch (error) {
    dispatch({ type: ActionType.AUTH_ERROR });
  }
};

export const login = (email: string, password: string) => async (dispatch: Dispatch) => {
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post(`${apiUrl}/api/auth`, body, axiosRequestConfig);
    dispatch<AppDispatch>({
      type: ActionType.LOGIN_SUCCESS,
      payload: res.data, // jwt token
    });
    dispatch(loadUser());
    dispatch(setAlert("Welcome back", AlertType.SUCCESS));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      //@ts-ignore
      const errors = error.response.data.errors;
      if (errors) errors.forEach((err: any) => dispatch(setAlert(err.msg, AlertType.DANGER)));
    } else console.log(error);
    dispatch({
      type: ActionType.LOGIN_FAIL,
    });
  }
};

export const register = (name: string, email: string, password: string) => async (dispatch: Dispatch) => {
  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post(`${apiUrl}/api/users`, body, axiosRequestConfig);
    dispatch({
      type: ActionType.REGISTER_SUCCESS,
      payload: res.data, // jwt token
    });
    dispatch(setAlert("Account created!", AlertType.SUCCESS));
    dispatch(loadUser());
  } catch (error) {
    console.log(error);
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, AlertType.DANGER)));
    }
    dispatch({
      type: ActionType.REGISTER_FAIL,
    });
  }
};

export const logout = () => async (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.LOGOUT,
  });
};

export const requestPasswordResetEmail = (email: string) => async (dispatch: Dispatch) => {
  const body = JSON.stringify(email);
  try {
    const res = await axios.post(`${apiUrl}/api/auth/request-password-reset`, body, axiosRequestConfig);
    dispatch(setAlert(res.data.msg, AlertType.SUCCESS));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, AlertType.DANGER)));
    }
  }
};

export const resetPassword =
  (password: string, password2: string, token: string, history: History) => async (dispatch: Dispatch) => {
    const body = JSON.stringify({ password, password2 });
    try {
      const res = await axios.post(`${apiUrl}/api/users/reset-password/${token}`, body, axiosRequestConfig);
      dispatch({
        type: ActionType.LOGIN_SUCCESS,
        payload: res.data.token, // jwt token
      });
      dispatch(setAlert(res.data.msg, AlertType.SUCCESS));
      history.push("/battle-room");
    } catch (error) {
      console.log(error.response.data.errors);
      const errors = error.response.data.errors;
      if (errors) {
        errors.forEach((err) => dispatch(setAlert(err.msg, AlertType.DANGER)));
      }
    }
  };

export const deleteAccount = (email: string) => async (dispatch: Dispatch) => {
  const body = JSON.stringify({ email });
  try {
    const res = await axios.post(`${apiUrl}/api/users/delete-account`, body, axiosRequestConfig);
    dispatch({
      type: ActionType.LOGOUT,
    });
    dispatch(setAlert(res.data.msg, AlertType.SUCCESS));
  } catch (error) {
    console.log(error.response.data.errors);
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, AlertType.DANGER)));
    }
  }
};
