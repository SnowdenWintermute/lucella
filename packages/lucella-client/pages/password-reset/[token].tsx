import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import { usePasswordResetMutation } from "../../redux/api-slices/auth-api-slice";
import { setAlert } from "../../redux/slices/alerts-slice";
import { useAppDispatch } from "../../redux";

const PasswordReset = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [resetPassword, { isLoading, isSuccess, error, isError }] = usePasswordResetMutation();

  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });

  const { password, password2 } = formData;
  const { token } = router.query;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== password2) dispatch(setAlert(new Alert("Passwords do not match.", AlertType.DANGER)));
    else if (!token)
      dispatch(
        setAlert(
          new Alert(
            "no password reset token provided, use the link in email to get a page with a token",
            AlertType.DANGER
          )
        )
      );
    else resetPassword({ password, password2, token: token.toString() });
  };

  useEffect(() => {
    if (isLoading) return;
    router.push("/battle-room");
  }, [isLoading, isSuccess, error, isError]);

  return (
    <div className="auth-frame">
      <h1 className="auth-brand-header">Lucella.org</h1>
      <h3 className="auth-header">Reset Password</h3>
      <form className="auth-form" onSubmit={(e) => onSubmit(e)}>
        <input
          className="simple-text-input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onChange(e)}
          autoFocus
        ></input>
        <input
          className="simple-text-input"
          type="password"
          name="password2"
          placeholder="Password2"
          value={password2}
          onChange={(e) => onChange(e)}
        ></input>
        <div className="auth-bottom-links">
          <Link href="/login">Log in to existing account</Link>
          <input type="submit" className="button button-standard-size button-primary" value="SET" />
        </div>
      </form>
    </div>
  );
};

export default PasswordReset;
