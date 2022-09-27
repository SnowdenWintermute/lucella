import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import { setAlert } from "../slices/alerts-slice";
import { IAuthState, setCredentials, setUser, logout } from "../slices/auth-slice";
import { IUser, LoginInput, RegisterInput } from "../types";
const API_URL = process.env.NEXT_PUBLIC_DEV_MODE ? process.env.NEXT_PUBLIC_API_DEV : process.env.NEXT_PUBLIC_API;

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api/auth`,
  credentials: "include",
  prepareHeaders(headers, { getState }) {
    const { auth } = getState() as { auth: IAuthState };
    const { token } = auth;
    if (token) headers.set("x-auth-token", token);
    return headers;
  },
});

export const authApiSlice = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  endpoints(builder) {
    return {
      registerUser: builder.mutation<string, RegisterInput>({
        query(data) {
          return {
            url: "/register",
            method: "POST",
            body: data,
          };
        },
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setCredentials(data)); // token
            await dispatch(authApiSlice.endpoints.getUser.initiate(null));
            dispatch(setAlert(new Alert("Account created!", AlertType.SUCCESS)));
          } catch (error: any) {
            console.log(error);
            dispatch(setAlert(new Alert(error.toString(), AlertType.DANGER)));
          }
        },
      }),
      loginUser: builder.mutation<string, LoginInput>({
        query(data) {
          return {
            url: "/login",
            method: "POST",
            body: data,
          };
        },
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setCredentials(data)); // token
            await dispatch(authApiSlice.endpoints.getUser.initiate(null));
            dispatch(setAlert(new Alert("Welcome back", AlertType.SUCCESS)));
          } catch (error: any) {
            console.log(error);
            dispatch(setAlert(new Alert(error.toString(), AlertType.DANGER)));
          }
        },
      }),
      getUser: builder.query<IUser, null>({
        query() {
          return {
            url: "",
            method: "GET",
          };
        },
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setUser(data));
          } catch (error: any) {
            console.log(error);
            dispatch(setAlert(new Alert(error.toString(), AlertType.DANGER)));
          }
        },
      }),
      requestPasswordResetEmail: builder.mutation<{ msg: string }, string>({
        query(email) {
          return {
            url: "/api/auth/request-password-reset",
            method: "POST",
            body: email,
          };
        },
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setAlert(new Alert(data.msg, AlertType.SUCCESS)));
          } catch (error: any) {
            console.log(error);
            dispatch(setAlert(new Alert(error.toString(), AlertType.DANGER)));
          }
        },
      }),
      resetPassword: builder.mutation<string, { password: string; password2: string; token: string }>({
        query(data) {
          const { password, password2, token } = data;
          return {
            url: `/users/reset-password/${token}`,
            method: "POST",
            body: JSON.stringify({ password, password2 }),
          };
        },
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(setCredentials(data)); // token
          } catch (error: any) {
            console.log(error);
            dispatch(setAlert(new Alert(error.toString(), AlertType.DANGER)));
          }
        },
      }),
      deleteAccount: builder.mutation<{ msg: string }, string>({
        query(email) {
          return {
            url: "/users/delete-account",
            method: "POST",
            body: JSON.stringify({ email }),
          };
        },
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(logout());
            dispatch(setAlert(new Alert(data.msg, AlertType.SUCCESS)));
          } catch (error: any) {
            console.log(error);
            dispatch(setAlert(new Alert(error.toString(), AlertType.DANGER)));
          }
        },
      }),
    };
  },
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserQuery,
  useDeleteAccountMutation,
  useRequestPasswordResetEmailMutation,
  useResetPasswordMutation,
} = authApiSlice;
