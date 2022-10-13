import cookies from "next-cookies";
import React from "react";
import { useCookies } from "react-cookie";
import { userApi } from "../../redux/api-slices/user-api-slice";

type IAuthMiddleware = {
  children: React.ReactElement;
  allCookies: { logged_in: boolean };
};

const AuthMiddleware: React.FC<IAuthMiddleware> = ({ allCookies, children }) => {
  // const { logged_in } = allCookies;
  const { isLoading } = userApi.endpoints.getMe.useQuery(null, {
    // skip: !logged_in,
  });

  console.log("From auth middleware: ", allCookies);

  if (isLoading) return <p>...</p>;

  return children;
};

export async function getServerSideProps(context: any) {
  const allCookies = cookies(context);
  console.log("auth middleware server side props: ", allCookies);
  return {
    props: { allCookies }, // will be passed to the page component as props
  };
}

export default AuthMiddleware;
