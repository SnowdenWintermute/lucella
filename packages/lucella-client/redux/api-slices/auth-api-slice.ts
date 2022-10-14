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
    registerUser: builder.mutation<Response, RegisterInput>({
      query(data) {
        return {
          url: "/auth/register",
          method: "POST",
          body: data,
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setAlert(new Alert("Account created!", AlertType.SUCCESS)));
          await dispatch(authApi.endpoints.loginUser.initiate({ email: args.email, password: args.password }));
        } catch (error) {
          dispatch(setAlert(new Alert("Registration failed", AlertType.DANGER)));
        }
      },
      // transformResponse: (result: { data: { user: IUser } }) => result.data.user,
    }),
    // LOGIN
    loginUser: builder.mutation<{ status: string }, LoginInput>({
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
          await dispatch(userApi.endpoints.getMe.initiate(null));
        } catch (error: any) {
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
    }),
    // DELETE ACCOUNT
    deleteAccount: builder.mutation<void, string>({
      query() {
        return {
          url: "auth/delete-account",
          credentials: "include",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setAlert(new Alert("Account deleted", AlertType.DANGER)));
          await dispatch(authApi.endpoints.logoutUser.initiate());
        } catch (error: any) {
          console.log(error);
          dispatch(setAlert(new Alert("Server error", AlertType.DANGER)));
        }
      },
    }),
  }),
});

export const { useLoginUserMutation, useRegisterUserMutation, useLogoutUserMutation, useDeleteAccountMutation } =
  authApi;
