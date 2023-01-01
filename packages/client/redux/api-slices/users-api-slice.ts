import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RegisterInput } from "../types";
import { setAlert } from "../slices/alerts-slice";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import { SanitizedUser, UsersRoutePaths } from "../../../common";
import { authApi } from "./auth-api-slice";

const API_URL = process.env.NEXT_PUBLIC_API;

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api${UsersRoutePaths.ROOT}`,
  prepareHeaders(headers, { getState }) {
    return headers;
  },
});

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // GET SELF
    getMe: builder.query<SanitizedUser, null>({
      query() {
        return {
          url: "",
          method: "GET",
          credentials: "include",
        };
      },
      providesTags: ["User"],
      transformResponse: (result: { user: SanitizedUser }) => result.user,
    }),
    // REGISTER
    registerUser: builder.mutation<Response, RegisterInput>({
      query(data) {
        return {
          url: "",
          method: "POST",
          body: data,
        };
      },
    }),
    // ACTIVATE ACCOUNT
    activateAccount: builder.mutation<Response, { token: string }>({
      query(data) {
        return {
          url: UsersRoutePaths.ACCOUNT_ACTIVATION,
          method: "POST",
          body: data,
        };
      },
    }),
    // DELETE ACCOUNT
    deleteAccount: builder.mutation<void, string>({
      query() {
        return {
          url: "",
          method: "DELETE",
          credentials: "include",
          // responseHandler: (response) => response.text(),
        };
      },
      invalidatesTags: ["User"],
    }),
    // RESET PASSWORD USING EMAILED TOKEN
    changePassword: builder.mutation<void, { password: string; passwordConfirm: string; token: string }>({
      query({ password, passwordConfirm, token }) {
        return {
          url: UsersRoutePaths.PASSWORD,
          method: "PUT",
          body: { password, passwordConfirm, token },
          // responseHandler: (response) => response.text(),
        };
      },
    }),
  }),
});

export const { useGetMeQuery, useRegisterUserMutation, useActivateAccountMutation, useDeleteAccountMutation, useChangePasswordMutation } = usersApi;
