import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Alert } from "../../../classes/Alert";
import { AlertType } from "../../../enums";
import { setAlert } from "../../../redux/slices/alerts-slice";
import { useAppDispatch } from "../../../redux/hooks";
import { useChangePasswordMutation } from "../../../redux/api-slices/users-api-slice";
import { CustomErrorDetails, InputFields, SuccessAlerts } from "../../../../../common";
import AuthPage from "../../../components/layout/auth/AuthPage";
import LabeledTextInputWithErrorDisplay from "../../../components/common-components/inputs/LabeledTextInputWithErrorDisplay";
import { BUTTON_NAMES } from "../../../consts/button-names";
import { useLogoutUserMutation } from "../../../redux/api-slices/auth-api-slice";

function ChangePassword() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [changePassword, { isLoading, isSuccess, error, isError }] = useChangePasswordMutation();
  const [logoutUser] = useLogoutUserMutation();
  const fields = { [InputFields.AUTH.PASSWORD]: "", [InputFields.AUTH.PASSWORD_CONFIRM]: "" };
  const [formData, setFormData] = useState(fields);
  const [fieldErrors, setFieldErrors] = useState(fields);

  const { password, passwordConfirm } = formData;
  const { email, token } = router.query;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    changePassword({ password, passwordConfirm, email: email?.toString() || "", token: token?.toString() || "" });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAlert(new Alert(SuccessAlerts.AUTH.PASSWORD_CHANGED, AlertType.SUCCESS)));
      logoutUser();
      router.push("/login");
    }
    if (isError && error && "data" in error) {
      const errors: CustomErrorDetails[] = error.data as CustomErrorDetails[];
      const newFieldErrors = { ...fieldErrors };
      errors.forEach((currError) => {
        console.log(currError);
        if (currError.field === InputFields.AUTH.PASSWORD) newFieldErrors.password = currError.message;
        if (currError.field === InputFields.AUTH.PASSWORD_CONFIRM) newFieldErrors.passwordConfirm = currError.message;
        dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
      });
      setFieldErrors(newFieldErrors);
    }
  }, [isError, isSuccess]);

  return (
    <AuthPage title="Change Password" submitHandler={submitHandler}>
      <div className="auth-form__inputs">
        <LabeledTextInputWithErrorDisplay
          label="Password"
          type="password"
          placeholder="Password"
          name={InputFields.AUTH.PASSWORD}
          value={password}
          onChange={onChange}
          disabled={isLoading || isSuccess}
          error={fieldErrors.password}
          autofocus
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
        <div className="auth-bottom-links">
          <Link href="/login" className="auth-form__link">
            Log in to existing account
          </Link>
        </div>
        <button type="submit" className="button button--accent auth-form__submit-button">
          {isLoading ? "..." : BUTTON_NAMES.AUTH_FORMS.CHANGE}
        </button>
      </div>
    </AuthPage>
  );
}

export default ChangePassword;
