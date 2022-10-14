import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next/types";
import React, { useEffect, useState } from "react";
import { useLoginUserMutation } from "../../redux/api-slices/auth-api-slice";
import { LoginInput } from "../../redux/types";
import Cookies from "js-cookie";

const Login = (props: { allCookies: { logged_in: boolean } }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [loginUser, { isLoading, isSuccess, error, isError }] = useLoginUserMutation();

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await loginUser(formData);
    setLoading(false);
  };

  useEffect(() => {
    if (Cookies.get("logged_in")) router.push("/battle-room");
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
          autoFocus
        ></input>
        <input
          className="simple-text-input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onChange(e)}
        ></input>
        <div className="forgot-password">
          <Link href="/request-password-reset">Forgot password?</Link>
        </div>
        <div className="auth-bottom-links">
          <Link href="/register">Create account</Link>
          <input
            type="submit"
            className="button button-standard-size button-primary"
            value={"SIGN"}
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
