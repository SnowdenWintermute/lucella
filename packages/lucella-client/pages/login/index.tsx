import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useLoginUserMutation } from "../../redux/api-slices/auth-api-slice";
import { LoginInput } from "../../redux/types";

const Login = () => {
  const [cookies] = useCookies(["logged_in"]);
  const router = useRouter();
  const [loginUser, { isLoading, isSuccess, error, isError }] = useLoginUserMutation();
  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;
    loginUser({ email, password });
  };

  useEffect(() => {
    console.log("effect in login.tsx", logged_in);
    if (logged_in) router.push("/battle-room");
  }, [logged_in]);

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
          <input type="submit" className="button button-standard-size button-primary" value="SIGN" />
        </div>
      </form>
    </div>
  );
};

export default Login;
