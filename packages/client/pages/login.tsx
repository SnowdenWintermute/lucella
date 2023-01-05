import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CustomErrorDetails, FrontendRoutes, InputFields, SuccessAlerts } from "../../common";
import { Alert } from "../classes/Alert";
import LabeledTextInputWithErrorDisplay from "../components/common-components/inputs/LabeledTextInputWithErrorDisplay";
import AuthPage from "../components/layout/auth/AuthPage";
import { ButtonNames } from "../consts/ButtonNames";
import { AlertType } from "../enums";
import { useLoginUserMutation } from "../redux/api-slices/auth-api-slice";
import { useGetMeQuery, usersApi } from "../redux/api-slices/users-api-slice";
import { useAppDispatch } from "../redux/hooks";
import { setAlert } from "../redux/slices/alerts-slice";
import { LoginInput } from "../redux/types";

function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loginUser, { isLoading, isSuccess, error, isError }] = useLoginUserMutation();
  const { data: user } = useGetMeQuery(null, { refetchOnMountOrArgChange: true });

  const fields = { email: "", password: "" };
  const [formData, setFormData] = useState<LoginInput>(fields);
  const [fieldErrors, setFieldErrors] = useState(fields);
  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await loginUser(formData);
  };

  useEffect(() => {
    if (user) router.push(FrontendRoutes.BATTLE_ROOM);
  }, [user]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(usersApi.endpoints.getMe.initiate(null));
      dispatch(setAlert(new Alert(SuccessAlerts.AUTH.LOGIN, AlertType.SUCCESS)));
      router.push("/battle-room");
    }
    if (isError && error && "data" in error) {
      console.log(error);
      const errors: CustomErrorDetails[] = error.data as CustomErrorDetails[];
      const newFieldErrors = { ...fieldErrors };
      errors.forEach((currError) => {
        if (currError.field === InputFields.AUTH.EMAIL) newFieldErrors.email = currError.message;
        if (currError.field === InputFields.AUTH.PASSWORD) newFieldErrors.password = currError.message;
        dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
      });
      setFieldErrors(newFieldErrors);
    }
  }, [isError, isSuccess]);

  return (
    <AuthPage title="Login" submitHandler={submitHandler}>
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
      <div className="forgot-password">
        <Link href="/request-password-reset">Forgot password?</Link>
      </div>
      <div className="auth-bottom-links">
        <Link href="/register">Create account</Link>
        <input
          type="submit"
          className="button button-standard-size button-primary"
          value={isLoading || isSuccess ? "..." : ButtonNames.AUTH_FORMS.LOGIN}
          disabled={isLoading || isSuccess}
        />
      </div>
    </AuthPage>
  );
}

export default Login;
