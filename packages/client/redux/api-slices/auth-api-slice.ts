import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithRefetch from "./baseQueryWithRefetch";
import { IUser, LoginInput, RegisterInput } from "../types";
import { setAlert } from "../slices/alerts-slice";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithRefetch,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // GET SELF
    getMe: builder.query<IUser, null>({
      query() {
        return {
          url: "auth/me",
          credentials: "include",
        };
      },
      providesTags: ["User"],
      transformResponse: (result: { data: { user: IUser } }) => result.data.user,
    }),
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
          await dispatch(authApi.endpoints.getMe.initiate(null));
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
      invalidatesTags: ["User"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(authApi.util.resetApiState());
      },
    }),
    // DELETE ACCOUNT
    deleteAccount: builder.mutation<void, string>({
      query() {
        return {
          url: "auth/delete-account",
          method: "DELETE",
          credentials: "include",
        };
      },
      invalidatesTags: ["User"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setAlert(new Alert("Account deleted", AlertType.SUCCESS)));
          await dispatch(authApi.util.resetApiState());
        } catch (error: any) {
          console.log(error);
          dispatch(setAlert(new Alert("Server error", AlertType.DANGER)));
        }
      },
    }),
    // REQUEST PASSWORD RESET EMAIL
    requestPasswordResetEmail: builder.mutation<void, string>({
      query(email) {
        return {
          url: "auth/request-password-reset-email",
          method: "POST",
          body: { email },
          credentials: "include",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setAlert(new Alert("An email has been sent with a link to reset your password", AlertType.SUCCESS)));
        } catch (error) {
          console.log(error);
          dispatch(setAlert(new Alert("Server error", AlertType.DANGER)));
        }
      },
    }),
    // RESET PASSWORD USING EMAILED TOKEN
    passwordReset: builder.mutation<void, { password: string; password2: string; token: string }>({
      query({ password, password2, token }) {
        return {
          url: "auth/password-reset",
          method: "PUT",
          body: { password, password2, token },
          credentials: "include",
        };
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(setAlert(new Alert("Password changed", AlertType.SUCCESS)));
        } catch (error: any) {
          console.log(error);
          dispatch(setAlert(new Alert(error.error?.data?.error, AlertType.DANGER)));
        }
      },
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useLogoutUserMutation,
  useDeleteAccountMutation,
  useRequestPasswordResetEmailMutation,
  usePasswordResetMutation,
} = authApi;