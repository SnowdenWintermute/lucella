import Link from "next/link";
import React, { Fragment, useState } from "react";
import { useRequestPasswordResetEmailMutation } from "../../redux/api-slices/auth-api-slice";

function RequestPasswordResetEmail() {
  const [requestPasswordResetEmail, { isLoading, isSuccess, error, isError }] = useRequestPasswordResetEmailMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email } = formData;
    requestPasswordResetEmail(email);
  };

  return (
    <div className="auth-frame">
      <h1 className="auth-brand-header">Lucella.org</h1>
      <h3 className="auth-header">Account Recovery</h3>
      <form className="auth-form" onSubmit={(e) => onSubmit(e)}>
        {isLoading ? (
          <span>loading...</span>
        ) : (
          <Fragment>
            <input className="simple-text-input" type="email" placeholder="Email" name="email" value={email} onChange={(e) => onChange(e)} autoFocus></input>
            <div className="forgot-password">Enter your email to request a password reset.</div>
            <div className="auth-bottom-links">
              <Link href="/login">Back to login</Link>
              <input type="submit" className="button button-standard-size button-primary" value="SEND" />
            </div>
          </Fragment>
        )}
      </form>
    </div>
  );
}

export default RequestPasswordResetEmail;
