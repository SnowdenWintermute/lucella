import axios from "axios";
import { ActionType } from "./types";
import { setAlert } from "./alert";
import { Dispatch } from "redux";
const apiUrl = process.env.REACT_APP_DEV_MODE ? process.env.REACT_APP_SOCKET_API_DEV : process.env.REACT_APP_SOCKET_API;

export const getLadderPage = (pageNumber: number) => async (dispatch: Dispatch) => {
  try {
    const res = await axios.get(`${apiUrl}/api/gameRecords/battle-room-ladder-page/${pageNumber}`);
    dispatch({
      type: ActionType.GET_LADDER_PAGE,
      payload: {
        pageNumber,
        totalNumberOfPages: res.data.totalNumberOfPages,
        pageData: res.data.pageData,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const changeLadderPageViewing = (pageNumber: number) => (dispatch: Dispatch) => {
  dispatch({
    type: ActionType.CHANGE_LADDER_PAGE_VIEWING,
    payload: pageNumber,
  });
};

export const getBattleRoomUserRecord = (username: string) => async (dispatch: Dispatch) => {
  try {
    const res = await axios.get(`${apiUrl}/api/gameRecords/battle-room-ladder/${username}`);
    dispatch({
      type: ActionType.GET_BATTLE_ROOM_USER_RECORD,
      payload: res.data,
    });
  } catch (error) {
    dispatch(setAlert("User not found. Please note that names are case sensitive", AlertType.DANGER));
  }
};
