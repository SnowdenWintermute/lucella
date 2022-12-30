import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginInput } from "../types";
import { setAlert } from "../slices/alerts-slice";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import { AuthRoutePaths } from "../../../common";
import { usersApi } from "./users-api-slice";

const API_URL = process.env.NEXT_PUBLIC_API;

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api${AuthRoutePaths.ROOT}`,
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
        queryFulfilled
          .then(() => {
            dispatch(authApi.util.resetApiState());
            dispatch(usersApi.util.resetApiState());
          })
          .catch((error) => {
            console.log("error resetting redux api states: ", error);
            dispatch(authApi.util.resetApiState());
            dispatch(usersApi.util.resetApiState());
          });
      },
    }),
    // REQUEST PASSWORD RESET EMAIL
    requestPasswordResetEmail: builder.mutation<void, string>({
      query(email) {
        return {
          url: AuthRoutePaths.REQUEST_PASSWORD_RESET_EMAIL,
          method: "POST",
          body: { email },
        };
      },
    }),
  }),
});

export const { useLoginUserMutation, useLogoutUserMutation, useRequestPasswordResetEmailMutation } = authApi;
