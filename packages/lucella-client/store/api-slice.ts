import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from ".";
import { AuthState } from "./auth-slice";
const apiUrl = process.env.REACT_APP_DEV_MODE ? process.env.REACT_APP_API_DEV : process.env.REACT_APP_API;

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiUrl}/api`,
    credentials: "include",
    prepareHeaders(headers, { getState }) {
      const { auth } = getState() as { auth: AuthState };
      const { token } = auth;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints(build) {
    return {
      login: build.mutation({
        query: ({ email, password }) => ({}),
      }),
    };
  },
});
