import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CustomErrorDetails, InputFields, SuccessAlerts } from "../../../common";
import { Alert } from "../classes/Alert";
import LabeledTextInputWithErrorDisplay from "../components/common-components/inputs/LabeledTextInputWithErrorDisplay";
import AuthPage from "../components/common-components/AuthPage/AuthPage";
import { BUTTON_NAMES } from "../consts/button-names";
import { AlertType } from "../enums";
import { useRequestPasswordResetEmailMutation } from "../redux/api-slices/auth-api-slice";
import { useAppDispatch } from "../redux/hooks";
import { setAlert } from "../redux/slices/alerts-slice";

function RequestPasswordResetEmail() {
  const dispatch = useAppDispatch();
  const [requestPasswordResetEmail, { isLoading, isSuccess, error, isError }] = useRequestPasswordResetEmailMutation();
  const [formData, setFormData] = useState({ [InputFields.AUTH.EMAIL]: "" });
  const [fieldErrors, setFieldErrors] = useState({ [InputFields.AUTH.EMAIL]: "" });
  const { email } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await requestPasswordResetEmail(email);
  };

  useEffect(() => {
    if (isSuccess) dispatch(setAlert(new Alert(SuccessAlerts.AUTH.CHANGE_PASSWORD_EMAIL_SENT, AlertType.SUCCESS)));
    if (isError && error && "data" in error) {
      const errors: CustomErrorDetails[] = error.data as CustomErrorDetails[];
      const newFieldErrors = { ...fieldErrors };
      errors.forEach((currError) => {
        if (currError.field === InputFields.AUTH.EMAIL) newFieldErrors.email = currError.message;
        dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
      });
      setFieldErrors(newFieldErrors);
    }
  }, [isError, isSuccess]);

  return (
    <AuthPage title="Account Recovery" submitHandler={submitHandler}>
      <div className="auth-form__inputs">
        <LabeledTextInputWithErrorDisplay
          label="Enter your email to request a password reset."
          type="email"
          placeholder="Email"
          name={InputFields.AUTH.EMAIL}
          value={email}
          onChange={onChange}
          disabled={isLoading || isSuccess}
          error={fieldErrors.email}
          autofocus
          extraStyles="auth-form__input"
        />
      </div>
      <div className="auth-form__bottom">
        <div className="auth-bottom-links">
          <Link href="/login" className="auth-form__link">
            Back to login
          </Link>
        </div>
        <button type="submit" className="button button--accent auth-form__submit-button">
          {isLoading ? "..." : BUTTON_NAMES.AUTH_FORMS.SEND}
        </button>
      </div>
    </AuthPage>
  );
}

export default RequestPasswordResetEmail;
