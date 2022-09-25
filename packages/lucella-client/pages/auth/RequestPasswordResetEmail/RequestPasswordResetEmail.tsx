import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { requestPasswordResetEmail } from "../../../redux/actions/auth";
import { RootState } from "../../../redux";

const RequestPasswordResetEmail = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const { isAuthenticated } = authState;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email } = formData;
    requestPasswordResetEmail(email);
  };

  // @ts-ignore
  if (isAuthenticated) return <Redirect to="/battle-room" />;

  return (
    <div className="auth-frame">
      <h1 className="auth-brand-header">Lucella.org</h1>
      <h3 className="auth-header">Account Recovery</h3>
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
        <div className="forgot-password">Enter your email to request a password reset.</div>
        <div className="auth-bottom-links">
          <Link to="/login">Back to login</Link>
          <input type="submit" className="button button-standard-size button-primary" value="SEND" />
        </div>
      </form>
    </div>
  );
};

export default RequestPasswordResetEmail;
