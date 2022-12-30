import { useRouter } from "next/router";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "../../redux/hooks";
import { AlertType } from "../../enums";
import { Alert } from "../../classes/Alert";
import { setAlert } from "../../redux/slices/alerts-slice";
import { RegisterInput } from "../../redux/types";
import { useRegisterUserMutation } from "../../redux/api-slices/users-api-slice";
import { authApi } from "../../redux/api-slices/auth-api-slice";
import { ErrorMessages, SuccessAlerts } from "../../../common";

function Register() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [registerUser, { isLoading: registerUserIsLoading, isSuccess: registerUserIsSuccess, error, isError }] = useRegisterUserMutation();
  const [formData, setFormData] = useState<RegisterInput>({
    email: "",
    name: "",
    password: "",
    passwordConfirm: "",
  });

  const { email, password, passwordConfirm, name } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== passwordConfirm) dispatch(setAlert(new Alert(ErrorMessages.VALIDATION.AUTH.PASSWORDS_DONT_MATCH, AlertType.DANGER)));
    else {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      });
      if (registerUserIsSuccess) {
        dispatch(setAlert(new Alert(SuccessAlerts.USERS.ACCOUNT_CREATED, AlertType.SUCCESS)));
        await dispatch(authApi.endpoints.loginUser.initiate({ email: formData.email, password: formData.password }));
      }
      if (isError) {
        dispatch(setAlert(new Alert("Registration failed", AlertType.DANGER)));
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (!registerUserIsSuccess || redirecting) return;
    setRedirecting(true);
    router.push("/battle-room");
  });

  return (
    <div className="auth-frame">
      <h1 className="auth-brand-header">Lucella.org</h1>
      <h3 className="auth-header">Create Account</h3>
      <form className="auth-form" onSubmit={(e) => submitHandler(e)}>
        <input className="simple-text-input" type="email" placeholder="Email" name="email" value={email} onChange={(e) => onChange(e)} autoFocus />
        <input className="simple-text-input" type="text" placeholder="Name" name="name" value={name} onChange={(e) => onChange(e)} />
        <input className="simple-text-input" type="password" name="password" placeholder="Password" value={password} onChange={(e) => onChange(e)} />
        <input
          className="simple-text-input"
          type="password"
          name="passwordConfirm"
          placeholder="passwordConfirm"
          value={passwordConfirm}
          onChange={(e) => onChange(e)}
        />
        <div className="auth-bottom-links">
          <Link href="/login">Log in to existing account</Link>
          <button type="submit" className="button button-standard-size button-primary" disabled={registerUserIsLoading}>
            {registerUserIsLoading ? "..." : "CREATE"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
