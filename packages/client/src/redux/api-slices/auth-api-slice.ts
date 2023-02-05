import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginInput } from "../types";
import { AuthRoutePaths, SERVER_HOSTNAME_DOCKER_COMPOSE } from "../../../../common";
import { usersApi } from "./users-api-slice";

// must use the plain text string for localhost because CI doesn't play nice with using an env variable for some reason

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NODE_ENV === "production" ? `${SERVER_HOSTNAME_DOCKER_COMPOSE}:8080` : `http://localhost:8080/api${AuthRoutePaths.ROOT}`,
  prepareHeaders(headers, { getState }) {
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // LOGIN
    loginUser: builder.mutation<void, LoginInput>({
      query(data) {
        return {
          url: "",
          method: "POST",
          body: data,
          credentials: "include",
          // responseHandler: (response) => response.text(),
        };
      },
    }),
    // LOGOUT
    logoutUser: builder.mutation<void, void>({
      query() {
        return {
          url: AuthRoutePaths.LOGOUT,
          method: "POST",
          credentials: "include",
        };
      },
      invalidatesTags: ["User"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        dispatch(usersApi.util.resetApiState());
      },
    }),
    // REQUEST PASSWORD RESET EMAIL
    requestPasswordResetEmail: builder.mutation<void, string>({
      query(email) {
        return {
          url: AuthRoutePaths.REQUEST_PASSWORD_RESET_EMAIL,
          method: "POST",
          body: { email },
          // responseHandler: (response) => response.text(),
        };
      },
    }),
  }),
});

export const { useLoginUserMutation, useLogoutUserMutation, useRequestPasswordResetEmailMutation } = authApi;
