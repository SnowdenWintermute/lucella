import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useLoginUserMutation } from "../../redux/api-slices/auth-api-slice";
import { LoginInput } from "../../redux/types";
import Cookies from "js-cookie";
import { userApi } from "../../redux/api-slices/user-api-slice";

const Login = () => {
  const router = useRouter();
  const loggedInCookie = Cookies.get("logged_in");
  const [redirecting, setRedirecting] = useState(false);
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [loginUser, { isLoading: loginUserIsLoading, isSuccess: loginUserIsSuccess, error, isError }] =
    useLoginUserMutation();
  const {
    data: userState,
    isLoading: userQueryIsLoading,
    isSuccess: userQueryIsSuccess,
    isFetching: userQueryIsFetching,
  } = userApi.endpoints.getMe.useQuery(null, { refetchOnMountOrArgChange: true });

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await loginUser(formData);
  };

  useEffect(() => {
    if (loginUserIsLoading || !loginUserIsSuccess || !userQueryIsSuccess || !loggedInCookie || redirecting) return;
    setRedirecting(true);
    router.push("/battle-room");
  }, [loginUserIsLoading, loginUserIsSuccess, loggedInCookie, userQueryIsSuccess]);

  return (
    <div className="auth-frame">
      <h1 className="auth-brand-header">Lucella.org</h1>
      <h3 className="auth-header">Sign In</h3>
      <form className="auth-form" onSubmit={(e) => onSubmit(e)}>
        <input
          className="simple-text-input"
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => onChange(e)}
          disabled={loginUserIsLoading || loginUserIsSuccess}
          autoFocus
        ></input>
        <input
          className="simple-text-input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onChange(e)}
          disabled={loginUserIsLoading || loginUserIsSuccess}
        ></input>
        <div className="forgot-password">
          <Link href="/request-password-reset">Forgot password?</Link>
        </div>
        <div className="auth-bottom-links">
          <Link href="/register">Create account</Link>
          <input
            type="submit"
            className="button button-standard-size button-primary"
            value={loginUserIsLoading || loginUserIsSuccess ? "..." : "SIGN"}
            disabled={loginUserIsLoading || loginUserIsSuccess}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
