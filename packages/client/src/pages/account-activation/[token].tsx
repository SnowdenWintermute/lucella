/* eslint-disable no-nested-ternary */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { CustomErrorDetails, ERROR_MESSAGES, SUCCESS_ALERTS } from "../../../../common";
import { Alert } from "../../classes/Alert";
import AuthPage from "../../components/common-components/AuthPage/AuthPage";
import { APP_TEXT } from "../../consts/app-text";
import { AlertType } from "../../enums";
import { useActivateAccountMutation } from "../../redux/api-slices/users-api-slice";
import { useAppDispatch } from "../../redux/hooks";
import { setAlert } from "../../redux/slices/alerts-slice";

export default function AccountActivation() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [registerUser, { isLoading, isSuccess, error, isError }] = useActivateAccountMutation();

  useEffect(() => {
    const { token } = router.query;
    if (!token) return;
    registerUser({ token: token!.toString() });
  }, [router.query.token]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(setAlert(new Alert(SUCCESS_ALERTS.USERS.ACCOUNT_CREATED, AlertType.SUCCESS)));
      router.push("/login");
    }
    if (isError && error && "data" in error) {
      const errors: CustomErrorDetails[] = error.data as CustomErrorDetails[];
      errors.forEach((currError) => {
        console.log(currError);
        setErrorMessage(currError.message);
        dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
      });
    }
  }, [isLoading, isSuccess, error, isError]);

  return (
    <AuthPage title={APP_TEXT.AUTH.PAGE_TITLES.ACCOUNT_ACTIVATION} submitHandler={() => {}}>
      {isLoading ? <p>Activating...</p> : isSuccess ? <p>Success!</p> : <p>{errorMessage}</p>}
    </AuthPage>
  );
}
