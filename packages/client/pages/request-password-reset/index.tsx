import Link from "next/link";
import React, { useState } from "react";
import { SuccessAlerts } from "../../../common";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import { useRequestPasswordResetEmailMutation } from "../../redux/api-slices/auth-api-slice";
import { useAppDispatch } from "../../redux/hooks";
import { setAlert } from "../../redux/slices/alerts-slice";

function RequestPasswordResetEmail() {
  const dispatch = useAppDispatch();
  const [requestPasswordResetEmail, { isLoading, isSuccess, error, isError }] = useRequestPasswordResetEmailMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email } = formData;
    await requestPasswordResetEmail(email);
    if (isSuccess) dispatch(setAlert(new Alert(SuccessAlerts.AUTH.CHANGE_PASSWORD_EMAIL_SENT, AlertType.SUCCESS)));
    if (isError) {
      console.log(error);
      dispatch(setAlert(new Alert("Server error", AlertType.DANGER)));
    }
  };

  return (
    <div className="auth-frame">
      <h1 className="auth-brand-header">Lucella.org</h1>
      <h3 className="auth-header">Account Recovery</h3>
      <form className="auth-form" onSubmit={(e) => onSubmit(e)}>
        <input className="simple-text-input" type="email" placeholder="Email" name="email" value={formData.email} onChange={(e) => onChange(e)} autoFocus />
        <div className="forgot-password">Enter your email to request a password reset.</div>
        <div className="auth-bottom-links">
          <Link href="/login">Back to login</Link>
          <button type="submit" className="button button-standard-size button-primary">
            {isLoading ? "..." : "SEND"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequestPasswordResetEmail;
