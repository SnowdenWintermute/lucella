import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import baseQueryWithRefetch from "./baseQueryWithRefetch";
import { IUser, LoginInput, RegisterInput } from "../types";
import { setAlert } from "../slices/alerts-slice";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import { AuthRoutePaths } from "../../../common";

const API_URL = process.env.NEXT_PUBLIC_API;

const baseQuery = fetchBaseQuery({
  baseUrl: `${API_URL}/api${AuthRoutePaths.ROOT}`,
  prepareHeaders(headers, { getState }) {
    return headers;
  },
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // GET SELF
    getMe: builder.query<IUser, null>({
      query() {
        return {
          url: AuthRoutePaths.ME,
          credentials: "include",
        };
      },
      providesTags: ["User"],
      transformResponse: (result: { user: IUser }) => result.user,
    }),
    // REGISTER
    registerUser: builder.mutation<Response, RegisterInput>({
      query(data) {
        return {
          url: AuthRoutePaths.REGISTER,
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
    loginUser: builder.mutation<void, LoginInput>({
      query(data) {
        return {
          url: AuthRoutePaths.LOGIN,
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
          console.log(error.error.status);
          dispatch(setAlert(new Alert("non-specific login error", AlertType.DANGER)));
        }
      },
    }),
    // LOGOUT
    logoutUser: builder.mutation<void, void>({
      query() {
        return {
          url: AuthRoutePaths.LOGOUT,
          credentials: "include",
        };
      },
      invalidatesTags: ["User"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        queryFulfilled
          .then(() => {
            dispatch(authApi.util.resetApiState());
          })
          .catch(() => {
            dispatch(authApi.util.resetApiState());
          });
      },
    }),
    // DELETE ACCOUNT
    deleteAccount: builder.mutation<void, string>({
      query() {
        return {
          url: AuthRoutePaths.DELETE_ACCOUNT,
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
          url: AuthRoutePaths.REQUEST_PASSWORD_RESET_EMAIL,
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
    passwordReset: builder.mutation<void, { password: string; passwordConfirm: string; token: string }>({
      query({ password, passwordConfirm, token }) {
        return {
          url: AuthRoutePaths.CHANGE_PASSWORD,
          method: "PUT",
          body: { password, passwordConfirm, token },
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
