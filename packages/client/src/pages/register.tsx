import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { AlertType } from "../enums";
import { Alert } from "../classes/Alert";
import { setAlert } from "../redux/slices/alerts-slice";
import { RegisterInput } from "../redux/types";
import { useGetMeQuery, useRegisterUserMutation } from "../redux/api-slices/users-api-slice";
import { CustomErrorDetails, FrontendRoutes, InputFields, SuccessAlerts } from "../../../common";
import LabeledTextInputWithErrorDisplay from "../components/common-components/inputs/LabeledTextInputWithErrorDisplay";
import AuthPage from "../components/layout/auth/AuthPage";
import { BUTTON_NAMES } from "../consts/button-names";

function Register() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading, isSuccess, error, isError }] = useRegisterUserMutation();
  const { data: user } = useGetMeQuery(null, { refetchOnMountOrArgChange: true });
  const fields = { email: "", name: "", password: "", passwordConfirm: "" };
  const [formData, setFormData] = useState<RegisterInput>(fields);
  const [fieldErrors, setFieldErrors] = useState(fields);
  const { email, password, passwordConfirm, name } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
    });
  };

  useEffect(() => {
    if (user) router.push(FrontendRoutes.BATTLE_ROOM);
  }, [user]);

  useEffect(() => {
    if (isSuccess) dispatch(setAlert(new Alert(SuccessAlerts.AUTH.ACCOUNT_ACTIVATION_EMAIL_SENT, AlertType.SUCCESS)));
    if (isError && error && "data" in error) {
      const errors: CustomErrorDetails[] = error.data as CustomErrorDetails[];
      const newFieldErrors = { ...fieldErrors };
      console.log("errors: ", errors);
      errors.forEach((currError) => {
        if (currError.field === InputFields.AUTH.EMAIL) newFieldErrors.email = currError.message;
        if (currError.field === InputFields.AUTH.NAME) newFieldErrors.name = currError.message;
        if (currError.field === InputFields.AUTH.PASSWORD) newFieldErrors.password = currError.message;
        if (currError.field === InputFields.AUTH.PASSWORD_CONFIRM) newFieldErrors.passwordConfirm = currError.message;
        dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
      });
      setFieldErrors(newFieldErrors);
    }
  }, [isError, isSuccess]);

  return isSuccess ? (
    <AuthPage title="Create Account" submitHandler={() => {}}>
      <p>{SuccessAlerts.AUTH.ACCOUNT_ACTIVATION_EMAIL_SENT}</p>
      <p>Please follow the link in your email to complete registration</p>
    </AuthPage>
  ) : (
    <AuthPage title="Create Account" submitHandler={submitHandler}>
      <div className="auth-form__inputs">
        <LabeledTextInputWithErrorDisplay
          label="Email Address"
          type="email"
          placeholder="Email"
          name={InputFields.AUTH.EMAIL}
          value={email}
          onChange={onChange}
          disabled={isLoading || isSuccess}
          error={fieldErrors.email}
          autofocus
          extraStyles="auth-form__input"
          dataCy="email-address-input"
        />
        <LabeledTextInputWithErrorDisplay
          label="Username"
          type="text"
          placeholder="Username"
          name={InputFields.AUTH.NAME}
          value={name}
          onChange={onChange}
          disabled={isLoading || isSuccess}
          error={fieldErrors.name}
          autofocus={false}
          extraStyles="auth-form__input"
        />
        <LabeledTextInputWithErrorDisplay
          label="Password"
          type="password"
          placeholder="Password"
          name={InputFields.AUTH.PASSWORD}
          value={password}
          onChange={onChange}
          disabled={isLoading || isSuccess}
          error={fieldErrors.password}
          autofocus={false}
          extraStyles="auth-form__input"
        />
        <LabeledTextInputWithErrorDisplay
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          name={InputFields.AUTH.PASSWORD_CONFIRM}
          value={passwordConfirm}
          onChange={onChange}
          disabled={isLoading || isSuccess}
          error={fieldErrors.passwordConfirm}
          autofocus={false}
          extraStyles="auth-form__input"
        />
      </div>
      <div className="auth-form__bottom">
        <div className="auth-form__bottom-links">
          <Link href="/login" className="auth-form__link">
            Log in to existing account
          </Link>
        </div>
        <button type="submit" className="button button--accent auth-form__submit-button" disabled={isLoading}>
          {isLoading || isSuccess ? "..." : BUTTON_NAMES.AUTH_FORMS.CREATE_ACCOUNT}
        </button>
      </div>
    </AuthPage>
  );
}

export default Register;
