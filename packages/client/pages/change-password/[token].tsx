import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import { setAlert } from "../../redux/slices/alerts-slice";
import { useAppDispatch } from "../../redux/hooks";
import { useChangePasswordMutation } from "../../redux/api-slices/users-api-slice";
import { ErrorMessages, InputFields } from "../../../common";

function ChangePassword() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [changePassword, { isLoading, isSuccess, error, isError, startedTimeStamp }] = useChangePasswordMutation();

  const [formData, setFormData] = useState({
    [InputFields.AUTH.PASSWORD]: "",
    [InputFields.AUTH.PASSWORD_CONFIRM]: "",
  });

  const { password, passwordConfirm } = formData;
  const { token } = router.query;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirm) dispatch(setAlert(new Alert(ErrorMessages.VALIDATION.AUTH.PASSWORDS_DONT_MATCH, AlertType.DANGER)));
    else if (!token) dispatch(setAlert(new Alert(ErrorMessages.AUTH.CHANGE_PASSWORD_TOKEN, AlertType.DANGER)));
    else changePassword({ password, passwordConfirm, token: token.toString() });
  };

  useEffect(() => {
    if (isLoading || !startedTimeStamp) return;
    if (isSuccess) router.push("/battle-room");
  }, [isLoading, isSuccess, error, isError, startedTimeStamp]);

  return (
    <div className="auth-frame">
      <h1 className="auth-brand-header">Lucella.org</h1>
      <h3 className="auth-header">Change Password</h3>
      <form className="auth-form" onSubmit={(e) => onSubmit(e)}>
        <input
          className="simple-text-input"
          type="password"
          name={InputFields.AUTH.PASSWORD}
          placeholder="Password"
          value={password}
          onChange={(e) => onChange(e)}
          autoFocus
        />
        <input
          className="simple-text-input"
          type="password"
          name={InputFields.AUTH.PASSWORD_CONFIRM}
          placeholder="Confirm Password"
          value={passwordConfirm}
          onChange={(e) => onChange(e)}
        />
        <div className="auth-bottom-links">
          <Link href="/login">Log in to existing account</Link>
          <input type="submit" className="button button-standard-size button-primary" value="SET" />
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
