import { createApi } from "@reduxjs/toolkit/query/react";
import { setUser } from "../slices/user-slice";
import baseQueryWithRefetch from "./baseQueryWithRefetch";
import { IUser } from "../types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithRefetch,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getMe: builder.query<IUser, null>({
      query() {
        console.log("get self redux query ");
        return {
          url: "users/me",
          credentials: "include",
        };
      },
      transformResponse: (result: { data: { user: IUser } }) => result.data.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch (error) {}
      },
    }),
  }),
});
