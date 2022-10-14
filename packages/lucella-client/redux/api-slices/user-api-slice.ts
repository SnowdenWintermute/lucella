import { createApi } from "@reduxjs/toolkit/query/react";
import baseQueryWithRefetch from "./baseQueryWithRefetch";
import { IUser } from "../types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithRefetch,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.query<IUser, null>({
      query() {
        return {
          url: "users/me",
          credentials: "include",
        };
      },
      transformResponse: (result: { data: { user: IUser } }) => result.data.user,
    }),
  }),
});
