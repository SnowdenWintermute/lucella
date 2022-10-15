import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import React, { useEffect, useState } from "react";
import { useLoginUserMutation } from "../../redux/api-slices/auth-api-slice";
import { LoginInput } from "../../redux/types";
import Cookies from "js-cookie";

const Login = (props: { allCookies: { logged_in: boolean } }) => {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [loginUser, { isLoading, isSuccess, error, isError }] = useLoginUserMutation();

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await loginUser(formData);
  };

  useEffect(() => {
    if (Cookies.get("logged_in") && !redirecting) {
      setRedirecting(true);
      router.push("/battle-room");
    }
  });

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
          disabled={isLoading || isSuccess}
          autoFocus
        ></input>
        <input
          className="simple-text-input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onChange(e)}
          disabled={isLoading || isSuccess}
        ></input>
        <div className="forgot-password">
          <Link href="/request-password-reset">Forgot password?</Link>
        </div>
        <div className="auth-bottom-links">
          <Link href="/register">Create account</Link>
          <input
            type="submit"
            className="button button-standard-size button-primary"
            value={isLoading || isSuccess ? "..." : "SIGN"}
            disabled={isLoading || isSuccess}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
