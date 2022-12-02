import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Mutex } from "async-mutex";

const API_URL = process.env.NEXT_PUBLIC_DEV_MODE ? process.env.NEXT_PUBLIC_API_DEV : process.env.NEXT_PUBLIC_API;
const baseUrl = `${API_URL}/api/`;
const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
  baseUrl,
});

const baseQueryWithRefetch: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  // wait until the mutex is available without locking it
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);
  if ((result.error?.data as any)?.message === "You are not logged in") {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQuery({ credentials: "include", url: "auth/refresh" }, api, extraOptions);
        if (refreshResult.data) result = await baseQuery(args, api, extraOptions); // Retry the initial query
        else {
          // api.dispatch(logOut());
          window.location.href = "/login";
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};

export default baseQueryWithRefetch;
