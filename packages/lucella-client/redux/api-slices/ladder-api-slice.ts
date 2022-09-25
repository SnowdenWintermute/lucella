import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Alert } from "../../classes/Alert";
import { UserRecord } from "../../classes/UserRecord";
import { AlertType } from "../../enums";
import { setAlert } from "../slices/alerts-slice";
import { IAuthState } from "../slices/auth-slice";
import { setLadderPageData, setSearchedUserData } from "../slices/ladder-slice";
const API_URL = process.env.REACT_APP_DEV_MODE ? process.env.REACT_APP_API_DEV : process.env.REACT_APP_API;

export interface ILadderPageResponse {
  pageNumber: number;
  totalNumberOfPages: number;
  pageData: UserRecord[];
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api`,
  credentials: "include",
  prepareHeaders(headers, { getState }) {
    const { auth } = getState() as { auth: IAuthState };
    const { token } = auth;
    if (token) headers.set("x-auth-token", token);
    return headers;
  },
});

export const ladderApiSlice = createApi({
  reducerPath: "ladderApi",
  baseQuery: baseQuery,
  endpoints(builder) {
    return {
      getLadderPage: builder.mutation<ILadderPageResponse, number>({
        query(pageNumber) {
          return {
            url: `/gameRecords/battle-room-ladder-page/${pageNumber}`,
            method: "GET",
          };
        },
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setLadderPageData(data));
          } catch (error: any) {
            console.log(error);
            dispatch(setAlert(new Alert(error.toString(), AlertType.DANGER)));
          }
        },
      }),
      getUserBattleRoomRecord: builder.mutation<UserRecord, string>({
        query(username) {
          return {
            url: `/gameRecords/battle-room-ladder/${username}`,
            method: "GET",
          };
        },
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setSearchedUserData(data));
          } catch (error: any) {
            console.log(error);
            dispatch(
              setAlert(new Alert("User not found. Please note that names are case sensitive", AlertType.DANGER))
            );
          }
        },
      }),
    };
  },
});
