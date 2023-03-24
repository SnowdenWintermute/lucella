import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BattleRoomLadderEntry, LadderRoutePaths, SERVER_HOSTNAME_DOCKER_PRODUCTION } from "../../../../common";

export interface ILadderPageResponse {
  totalNumberOfPages: number;
  pageData: BattleRoomLadderEntry[];
}

// must use the plain text string for localhost because CI doesn't play nice with using an env variable for some reason

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NODE_ENV === "production"
      ? `${SERVER_HOSTNAME_DOCKER_PRODUCTION}${LadderRoutePaths.ROOT + LadderRoutePaths.BATTLE_ROOM}`
      : `${process.env.NEXT_PUBLIC_API}/api${LadderRoutePaths.ROOT + LadderRoutePaths.BATTLE_ROOM}`,
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
            url: `/${pageNumber}`,
            method: "GET",
          };
        },
        keepUnusedDataFor: 0,
      }),
      getLadderEntry: builder.query<{ ladderEntry: BattleRoomLadderEntry }, string>({
        query(username) {
          return {
            url: `${LadderRoutePaths.ENTRIES}/${username}`,
            method: "GET",
          };
        },
      }),
    };
  },
});

export const { useGetLadderPageQuery, useGetLadderEntryQuery } = ladderApi;
