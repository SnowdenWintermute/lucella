import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithRefetch from "./baseQueryWithRefetch";
import { IUser, LoginInput, RegisterInput } from "../types";
import { userApi } from "./user-api-slice";
import { setAlert } from "../slices/alerts-slice";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithRefetch,
  endpoints: (builder) => ({
    // REGISTER
    registerUser: builder.mutation<IUser, RegisterInput>({
      query(data) {
        return {
          url: "/auth/register",
          method: "POST",
          body: data,
        };
      },
      async onQueryStarted(ards, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setAlert(new Alert("Account created!", AlertType.SUCCESS)));
        } catch (error) {
          dispatch(setAlert(new Alert("registration failed", AlertType.DANGER)));
        }
      },
      transformResponse: (result: { data: { user: IUser } }) => result.data.user,
    }),
    // LOGIN
    loginUser: builder.mutation<{ access_token: string; status: string }, LoginInput>({
      query(data) {
        return {
          url: "auth/login",
          method: "POST",
          body: data,
          credentials: "include",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const data = await queryFulfilled;
          console.log("login data: ", data);
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error: any) {
          // console.log(error.error.data.error);
          console.log(error);
          dispatch(setAlert(new Alert("non-specific login error", AlertType.DANGER)));
        }
      },
    }),
    // LOGOUT
    logoutUser: builder.mutation<void, void>({
      query() {
        return {
          url: "auth/logout",
          credentials: "include",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        console.log("logout mutation dispatched");
      },
    }),
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation, useLogoutUserMutation } = authApi;
