import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_HOSTNAME_DOCKER_PRODUCTION, BattleRoomConfigRoutePaths, BattleRoomGameConfigOptionIndicesUpdate } from "../../../../common";

interface IBattleRoomGameSettingsResponse {
  //
}

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NODE_ENV === "production"
      ? `${SERVER_HOSTNAME_DOCKER_PRODUCTION}${BattleRoomConfigRoutePaths.ROOT}`
      : `${process.env.NEXT_PUBLIC_API}/api${BattleRoomConfigRoutePaths.ROOT}`,
  prepareHeaders(headers, { getState }) {
    return headers;
  },
});

export const battleRoomGameSettingsApi = createApi({
  reducerPath: "battleRoomGameSettingsApi",
  baseQuery,
  endpoints(builder) {
    return {
      getUserBattleRoomGameSettings: builder.query<IBattleRoomGameSettingsResponse, null>({
        query() {
          return {
            url: "",
            method: "GET",
            credentials: "include",
          };
        },
        keepUnusedDataFor: 0,
      }),
      updateBattleRoomGameSettings: builder.mutation<void, BattleRoomGameConfigOptionIndicesUpdate>({
        query(newValues) {
          return {
            url: "",
            method: "PUT",
            credentials: "include",
            body: { ...newValues },
          };
        },
      }),
      resetBattleRoomGameSettings: builder.mutation<void, null>({
        query() {
          return {
            url: BattleRoomConfigRoutePaths.RESET,
            method: "PUT",
            credentials: "include",
            body: {},
          };
        },
      }),
    };
  },
});

export const { useGetUserBattleRoomGameSettingsQuery, useUpdateBattleRoomGameSettingsMutation, useResetBattleRoomGameSettingsMutation } =
  battleRoomGameSettingsApi;
