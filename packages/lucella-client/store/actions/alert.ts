import uuid from "uuid";
import { defaultAlertTimeout } from "../../consts";
import { AlertType } from "../../enums";
import { ActionType } from "./types";
import { Dispatch } from "redux";

export const setAlert =
  (message: string, type: AlertType, timeout = defaultAlertTimeout) =>
  (dispatch: Dispatch) => {
    const id = uuid.v4();
    if (!message) message = "Something went wrong: (undefined error message)";
    dispatch({
      type: ActionType.SET_ALERT,
      payload: {
        message,
        type,
        id,
      },
    });
    setTimeout(() => dispatch({ type: ActionType.REMOVE_ALERT, payload: id }), timeout);
  };

export const clearAlert = (id: string) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.REMOVE_ALERT,
    payload: id,
  });
};
