import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RegisterInput } from "../types";
import { Ban, SERVER_HOSTNAME_DOCKER_PRODUCTION, SanitizedUser, UsersRoutePaths } from "../../../../common";

// must use the plain text string for localhost because CI doesn't play nice with using an env variable for some reason

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NODE_ENV === "production"
      ? `${SERVER_HOSTNAME_DOCKER_PRODUCTION}${UsersRoutePaths.ROOT}`
      : `${process.env.NEXT_PUBLIC_API}/api${UsersRoutePaths.ROOT}`,
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
    deleteAccount: builder.mutation<void, { email: string; password: string }>({
      query(data) {
        return {
          url: UsersRoutePaths.ACCOUNT_DELETION,
          method: "PUT",
          credentials: "include",
          body: data,
          // responseHandler: (response) => response.text(),
        };
      },
      invalidatesTags: ["User"],
    }),
    // BAN ACCOUNT
    banAccount: builder.mutation<void, { name: string; ban: Ban }>({
      query(data) {
        return {
          url: UsersRoutePaths.ACCOUNT_BAN,
          method: "PUT",
          credentials: "include",
          body: data,
        };
      },
      invalidatesTags: ["User"],
    }),
    // RESET PASSWORD USING EMAILED TOKEN
    changePassword: builder.mutation<void, { password: string; passwordConfirm: string; email: string; token: string }>({
      query({ password, passwordConfirm, email, token }) {
        return {
          url: UsersRoutePaths.PASSWORD,
          method: "PUT",
          body: { password, passwordConfirm, email, token },
          // responseHandler: (response) => response.text(),
        };
      },
    }),
  }),
});

export const {
  useGetMeQuery,
  useRegisterUserMutation,
  useActivateAccountMutation,
  useDeleteAccountMutation,
  useBanAccountMutation,
  useChangePasswordMutation,
} = usersApi;
