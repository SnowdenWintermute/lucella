import uuid from "uuid";
import { SET_ALERT, REMOVE_ALERT, ANIMATE_ALERT } from "./types";

export const setAlert = (msg, alertType, timeout = 3000) => dispatch => {
  const id = uuid.v4();
  dispatch({
    type: SET_ALERT,
    payload: {
      msg,
      alertType,
      id,
      animating: false
    }
  });
  setTimeout(
    () =>
      dispatch({
        type: ANIMATE_ALERT,
        payload: { msg, animateAlert: true }
      }),
    1
  );
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
