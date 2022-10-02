import { useCookies } from "react-cookie";
import { userApi } from "../../redux/api-slices/user-api-slice";
import { useRouter } from "next/router";
import React, { Fragment, ReactNode, useEffect } from "react";

interface Props {
  allowedRoles: string[];
  children: JSX.Element | JSX.Element[];
}

const RequireUser = ({ allowedRoles, children }: Props) => {
  const [cookies] = useCookies(["logged_in"]);
  const router = useRouter();
  const location = router.pathname;
  const { isLoading, isFetching } = userApi.endpoints.getMe.useQuery(null, {
    skip: false,
    refetchOnMountOrArgChange: true,
  });
  const loading = isLoading || isFetching;

  const user = userApi.endpoints.getMe.useQueryState(null, {
    selectFromResult: ({ data }) => data!,
  });

  useEffect(() => {
    if ((!logged_in && !user) || !allowedRoles.includes(user?.role as string)) {
      if (logged_in && user)
        router.replace({
          pathname: "/unauthorized",
          query: { from: location },
        });
      else
        router.replace({
          pathname: "/login",
          query: { from: location },
        });
    }
  }, [logged_in]);

  if (loading) return <p>...</p>;
  return <Fragment>{children}</Fragment>;
};

export default RequireUser;
