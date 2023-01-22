import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UserRecord } from "../../classes/UserRecord";

export interface ILadderPageResponse {
  pageNumber: number;
  totalNumberOfPages: number;
  pageData: UserRecord[];
}

// must use the plain text string for localhost because CI doesn't play nice with using an env variable for some reason

const baseQuery = fetchBaseQuery({
  baseUrl: `http://localhost:8080/api`,
  prepareHeaders(headers, { getState }) {
    return headers;
  },
});

export const ladderApi = createApi({
  reducerPath: "ladderApi",
  baseQuery,
  endpoints(builder) {
    return {
      getLadderPage: builder.query<ILadderPageResponse, number>({
        query(pageNumber) {
          return {
            url: `/gameRecords/battle-room-ladder-page/${pageNumber}`,
            method: "GET",
          };
        },
      }),
      getUserBattleRoomRecord: builder.query<UserRecord, string>({
        query(username) {
          return {
            url: `/gameRecords/battle-room-ladder/${username}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const { useGetLadderPageQuery, useGetUserBattleRoomRecordQuery } = ladderApi;
