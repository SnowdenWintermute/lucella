import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CustomErrorDetails, FrontendRoutes, InputFields, SUCCESS_ALERTS } from "../../../common";
import { Alert } from "../classes/Alert";
import LabeledTextInputWithErrorDisplay from "../components/common-components/inputs/LabeledTextInputWithErrorDisplay";
import AuthPage from "../components/common-components/AuthPage/AuthPage";
import { BUTTON_NAMES } from "../consts/button-names";
import { AlertType } from "../enums";
import { useLoginUserMutation } from "../redux/api-slices/auth-api-slice";
import { useGetMeQuery, usersApi } from "../redux/api-slices/users-api-slice";
import { useAppDispatch } from "../redux/hooks";
import { setAlert } from "../redux/slices/alerts-slice";
import { LoginInput } from "../redux/types";
import { APP_TEXT } from "../consts/app-text";

function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loginUser, { isLoading, isSuccess, error, isError }] = useLoginUserMutation();
  const { data: user } = useGetMeQuery(null);

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
      dispatch(setAlert(new Alert(SUCCESS_ALERTS.AUTH.LOGIN, AlertType.SUCCESS)));
      router.push("/battle-room");
    }
    if (isError && error && "data" in error) {
      console.log(error);
      const errors: CustomErrorDetails[] = error.data as CustomErrorDetails[];
      console.log(error.data);
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
    <AuthPage title={APP_TEXT.AUTH.PAGE_TITLES.LOGIN} submitHandler={submitHandler}>
      <div className="auth-form__inputs">
        <LabeledTextInputWithErrorDisplay
          label={APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}
          type="email"
          placeholder="Email"
          name={InputFields.AUTH.EMAIL}
          value={email}
          onChange={onChange}
          disabled={isLoading || isSuccess}
          error={fieldErrors.email}
          autofocus
          dataCy="email-address-input"
          extraStyles="auth-form__input"
        />
        <LabeledTextInputWithErrorDisplay
          label={APP_TEXT.AUTH.INPUTS.PASSWORD}
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
      </div>
      <div className="auth-form__bottom">
        <div className="auth-form__bottom-links">
          <Link href="/request-password-reset" className="auth-form__link">
            {APP_TEXT.AUTH.LINKS.RESET_PASSWORD}
          </Link>
          <Link href="/register" className="auth-form__link">
            {APP_TEXT.AUTH.LINKS.CREATE_ACCOUNT}
          </Link>
        </div>
        <button type="submit" className="button button--accent auth-form__submit-button" disabled={isLoading || isSuccess}>
          {isLoading || isSuccess ? "..." : BUTTON_NAMES.AUTH_FORMS.LOGIN}
        </button>
      </div>
    </AuthPage>
  );
}

export default Login;
