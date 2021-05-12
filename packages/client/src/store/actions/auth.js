import axios from "axios";
import { setAlert } from "./alert";
import { getCurrentProfile } from "./profile";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  CLEAR_PROFILE,
} from "./types";
import setAuthToken from "../../utils/setAuthToken";

// const apiUrl = process.env.REACT_APP_DEV_MODE
//   ? process.env.REACT_APP_SOCKET_API_DEV
//   : process.env.REACT_APP_SOCKET_API;

const apiUrl = "http://45.77.203.192"

// load user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get(`${apiUrl}/api/auth`);
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (error) {
    dispatch({ type: AUTH_ERROR });
  }
};

// login user
export const login = ({ email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post(`${apiUrl}/api/auth`, body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data, // jwt token
    });
    dispatch(loadUser());
    dispatch(getCurrentProfile());
    dispatch(setAlert("Welcome back", "success"));
  } catch (error) {
    const errors = error.response?.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, "danger")));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// register user
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password });
  try {
    const res = await axios.post(`${apiUrl}/api/users`, body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data, // jwt token
    });
    dispatch(setAlert("Account created!", "success"));
    dispatch(loadUser());
  } catch (error) {
    console.log(error);
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, "danger")));
    }
    dispatch({
      type: REGISTER_FAIL,
    });
  }
};

// logout user / clear profile
export const logout = () => async (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE,
  });
  dispatch({
    type: LOGOUT,
  });
};

// request password reset email
export const requestPasswordResetEmail = (email) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify(email);
  try {
    const res = await axios.post(
      `${apiUrl}/api/auth/request-password-reset`,
      body,
      config
    );
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, "danger")));
    }
  }
};

// change to a new password
export const resetPassword = ({
  password,
  password2,
  token,
  history,
}) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ password, password2 });
  try {
    const res = await axios.post(
      `${apiUrl}/api/users/reset-password/${token}`,
      body,
      config
    );
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.token, // jwt token
    });
    dispatch(setAlert(res.data.msg, "success"));
    history.push("/games");
  } catch (error) {
    console.log(error.response.data.errors);
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, "danger")));
    }
  }
};

// delete account
export const deleteAccount = ({ email, history }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const body = JSON.stringify({ email });

  try {
    const res = await axios.post(
      `${apiUrl}/api/users/delete-account`,
      body,
      config
    );

    dispatch({
      type: LOGOUT,
    });
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    console.log(error.response.data.errors);
    const errors = error.response.data.errors;
    if (errors) {
      errors.forEach((err) => dispatch(setAlert(err.msg, "danger")));
    }
  }
};
