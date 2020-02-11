import axios from "axios";
import { setAlert } from "./alert";

import { GET_PROFILE, GET_PROFILES, PROFILE_ERROR } from "./types";

// get current user profile
export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.data.msg
          ? error.response.data.msg
          : error.responseText,
        status: error.response.status
      }
    });
  }
};
