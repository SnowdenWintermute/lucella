import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Alert } from "../../classes/Alert";
import { UserRecord } from "../../classes/UserRecord";
import { AlertType } from "../../enums";
import { setAlert } from "../slices/alerts-slice";
import { IAuthState } from "../slices/auth-slice";
import { setViewingSearchedUser } from "../slices/ladder-slice";
const API_URL = process.env.NEXT_PUBLIC_DEV_MODE ? process.env.NEXT_PUBLIC_API_DEV : process.env.NEXT_PUBLIC_API;

export interface ILadderPageResponse {
  pageNumber: number;
  totalNumberOfPages: number;
  pageData: UserRecord[];
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api`,
  prepareHeaders(headers, { getState }) {
    console.log(API_URL);
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
      getLadderPage: builder.query<ILadderPageResponse, number>({
        query(pageNumber) {
          return {
            url: `/gameRecords/battle-room-ladder-page/${pageNumber}`,
            method: "GET",
          };
        },
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setViewingSearchedUser(false));
          } catch (error: any) {
            console.log(error);
            dispatch(setAlert(new Alert("Error fetching ladder data", AlertType.DANGER)));
          }
        },
      }),
      getUserBattleRoomRecord: builder.query<UserRecord, string>({
        query(username) {
          return {
            url: `/gameRecords/battle-room-ladder/${username}`,
            method: "GET",
          };
        },
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setViewingSearchedUser(true));
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

export const { useGetLadderPageQuery, useGetUserBattleRoomRecordQuery } = ladderApiSlice;
