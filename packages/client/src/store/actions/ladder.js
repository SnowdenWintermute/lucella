import axios from "axios";
import {
  GET_LADDER_PAGE,
  CHANGE_LADDER_PAGE_VIEWING,
  GET_BATTLE_ROOM_USER_RECORD,
} from "./types";
import { setAlert } from "./alert";
// const apiUrl = process.env.REACT_APP_DEV_MODE
//   ? process.env.REACT_APP_SOCKET_API_DEV
//   : process.env.REACT_APP_SOCKET_API;

const apiUrl = "http://45.77.203.192"

// get a ladder page
export const getLadderPage = (pageNumber) => async (dispatch) => {
  try {
    const res = await axios.get(
      `${apiUrl}/api/gameRecords/battle-room-ladder-page/${pageNumber}`
    );
    dispatch({
      type: GET_LADDER_PAGE,
      payload: {
        pageNumber,
        totalNumberOfPages: res.data.totalNumberOfPages,
        pageData: res.data.pageData,
      },
    });
  } catch (error) {
    console.log(error.response);
  }
};

// change page viewing
export const changeLadderPageViewing = (pageNumber) => (dispatch) => {
  dispatch({
    type: CHANGE_LADDER_PAGE_VIEWING,
    payload: pageNumber,
  });
};

// lookup user record
export const getBattleRoomUserRecord = (username) => async (dispatch) => {
  try {
    const res = await axios.get(
      `${apiUrl}/api/gameRecords/battle-room-ladder/${username}`
    );
    dispatch({
      type: GET_BATTLE_ROOM_USER_RECORD,
      payload: res.data,
    });
  } catch (error) {
    dispatch(
      setAlert(
        "User not found. Please note that names are case sensitive",
        "danger"
      )
    );
  }
};
