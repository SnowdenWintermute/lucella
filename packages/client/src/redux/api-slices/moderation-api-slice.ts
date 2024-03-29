import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SERVER_HOSTNAME_DOCKER_PRODUCTION, IPBanReason, ModerationRoutePaths } from "../../../../common";

const baseQuery = fetchBaseQuery({
  baseUrl:
    process.env.NODE_ENV === "production"
      ? `${SERVER_HOSTNAME_DOCKER_PRODUCTION}${ModerationRoutePaths.ROOT}`
      : `${process.env.NEXT_PUBLIC_API}/api${ModerationRoutePaths.ROOT}`,
  prepareHeaders(headers, { getState }) {
    return headers;
  },
});

export const moderationApi = createApi({
  reducerPath: "moderationApi",
  baseQuery,
  endpoints: (builder) => ({
    // BAN IP ADDRESS
    banIpAddress: builder.mutation<void, { name: string; duration: number | undefined; reason: IPBanReason }>({
      query({ name, duration, reason }) {
        return {
          url: ModerationRoutePaths.IP_BAN,
          method: "POST",
          credentials: "include",
          body: {
            name,
            duration,
            reason,
          },
        };
      },
    }),
  }),
});

export const { useBanIpAddressMutation } = moderationApi;
