import axios from "axios";
import { GET_LADDER_PAGE } from "./types";

// get current user profile
export const getLadderPage = (pageNumber) => async (dispatch) => {
  try {
    const res = await axios.get(
      `/api/gameRecords/battle-room-ladder-page/${pageNumber}`,
    );
    dispatch({
      type: GET_LADDER_PAGE,
      payload: { pageNumber, pageData: res.data },
    });
  } catch (error) {
    console.log(error.response);
  }
};
