import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../redux/hooks";
import { AlertType } from "../enums";
import { Alert } from "../classes/Alert";
import { setAlert } from "../redux/slices/alerts-slice";
import { RegisterInput } from "../redux/types";
import { useRegisterUserMutation } from "../redux/api-slices/users-api-slice";
import { authApi } from "../redux/api-slices/auth-api-slice";
import { CustomErrorDetails, InputFields, SuccessAlerts } from "../../common/dist";
import LabeledTextInputWithErrorDisplay from "../components/common-components/inputs/LabeledTextInputWithErrorDisplay";
import styles from "./auth.module.scss";
import AuthPage from "../components/layout/auth/AuthPage";

function Register() {
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading, isSuccess, error, isError }] = useRegisterUserMutation();
  const fields = { email: "", name: "", password: "", passwordConfirm: "" };
  const [formData, setFormData] = useState<RegisterInput>(fields);
  const [fieldErrors, setFieldErrors] = useState(fields);
  const { email, password, passwordConfirm, name } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
    });
    if (isSuccess) {
      // send email
      // change display of this page
      // router.push("/battle-room");
      dispatch(setAlert(new Alert(SuccessAlerts.USERS.ACCOUNT_CREATED, AlertType.SUCCESS)));
      await dispatch(authApi.endpoints.loginUser.initiate({ email: formData.email, password: formData.password }));
    }
  };

  useEffect(() => {
    if (isError && error && "data" in error) {
      const errors: CustomErrorDetails[] = error.data as CustomErrorDetails[];
      const newFieldErrors = { ...fieldErrors };
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

  return (
    <AuthPage title="Create Account" submitHandler={submitHandler}>
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
      />
      <div className="auth-bottom-links">
        <Link href="/login">Log in to existing account</Link>
        <button type="submit" className="button button-standard-size button-primary" disabled={isLoading}>
          {isLoading || isSuccess ? "..." : "CREATE"}
        </button>
      </div>
    </AuthPage>
  );
}

export default Register;
