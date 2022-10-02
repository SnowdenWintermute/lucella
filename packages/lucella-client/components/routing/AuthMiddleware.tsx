import React from "react";
import { useCookies } from "react-cookie";
import { userApi } from "../../redux/api-slices/user-api-slice";

type IAuthMiddleware = {
  children: React.ReactElement;
};

const AuthMiddleware: React.FC<IAuthMiddleware> = ({ children }) => {
  const [cookies] = useCookies(["logged_in"]);
  const { isLoading } = userApi.endpoints.getMe.useQuery(null, {
    skip: !logged_in,
  });

  console.log("From auth middleware: ", logged_in);

  if (isLoading) return <p>...</p>;

  return children;
};

export default AuthMiddleware;
