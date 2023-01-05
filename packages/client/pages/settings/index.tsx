/* eslint-disable no-nested-ternary */
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Modal from "../../components/common-components/modal/Modal";
import { authApi, useLogoutUserMutation, useRequestPasswordResetEmailMutation } from "../../redux/api-slices/auth-api-slice";
import { useAppDispatch } from "../../redux/hooks";
import { setAlert } from "../../redux/slices/alerts-slice";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import { useDeleteAccountMutation, useGetMeQuery } from "../../redux/api-slices/users-api-slice";
import { CustomErrorDetails, ErrorMessages, InputFields, SuccessAlerts } from "../../../common";
import LabeledTextInputWithErrorDisplay from "../../components/common-components/inputs/LabeledTextInputWithErrorDisplay";
import { LoginInput } from "../../redux/types";
import { ButtonNames } from "../../consts/ButtonNames";

function Settings() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [displayDeleteAccountModal, setDisplayDeleteAccountModal] = useState(false);
  const [deleteAccount, { isLoading: deleteAccountIsLoading, isSuccess: deleteAccountIsSuccess, isError: deleteAccountIsError, error: deleteAccountError }] =
    useDeleteAccountMutation();
  const [logoutUser] = useLogoutUserMutation();
  const [
    requestPasswordResetEmail,
    { isLoading: passwordResetIsLoading, isSuccess: passwordResetIsSuccess, isError: passwordResetIsError, error: passwordResetError },
  ] = useRequestPasswordResetEmailMutation();
  const {
    data: user,
    isLoading: userQueryIsLoading,
    isSuccess: userQueryIsSuccess,
    isFetching: userQueryIsFetching,
  } = useGetMeQuery(null, { refetchOnMountOrArgChange: true });

  const fields = { email: "", password: "" };
  const [formData, setFormData] = useState<LoginInput>(fields);
  const [fieldErrors, setFieldErrors] = useState(fields);
  const { email, password } = formData;
  const accountEmail = user?.email ? user.email : "...";

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldErrors({ ...fieldErrors, [e.target.name]: "" });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // MODAL - must pass function to modal so the modal can send props back to parent and set display to false from within modal component
  const setParentDisplay = (status: boolean) => {
    setDisplayDeleteAccountModal(status);
  };
  const showDeleteAccountModal = () => {
    setDisplayDeleteAccountModal(true);
  };

  const handleRequestChangePasswordEmail = async () => {
    await requestPasswordResetEmail(accountEmail);
  };

  const handleSubmitDeleteAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email !== user?.email) {
      const newFieldErrors = { ...fieldErrors };
      newFieldErrors.email = ErrorMessages.VALIDATION.AUTH.CONFIRM_DELETE_ACCOUNT_EMAIL_MATCH;
      setFieldErrors(newFieldErrors);
      dispatch(setAlert(new Alert(ErrorMessages.VALIDATION.AUTH.CONFIRM_DELETE_ACCOUNT_EMAIL_MATCH, AlertType.DANGER)));
    } else await deleteAccount({ email, password });
  };

  useEffect(() => {
    if (passwordResetIsSuccess) dispatch(setAlert(new Alert(SuccessAlerts.AUTH.CHANGE_PASSWORD_EMAIL_SENT, AlertType.SUCCESS)));
    if (passwordResetIsError) {
      console.log(passwordResetError);
      dispatch(setAlert(new Alert(ErrorMessages.AUTH.CHANGE_PASSWORD_EMAIL, AlertType.DANGER)));
    }
  }, [passwordResetIsSuccess, passwordResetIsError]);

  useEffect(() => {
    if (deleteAccountIsSuccess) {
      dispatch(setAlert(new Alert(SuccessAlerts.USERS.ACCOUNT_DELETED, AlertType.SUCCESS)));
      logoutUser();
      dispatch(authApi.util.resetApiState());
      router.push("/register");
    }
    if (deleteAccountIsError && deleteAccountError && "data" in deleteAccountError) {
      console.log(deleteAccountError);
      const errors: CustomErrorDetails[] = deleteAccountError.data as CustomErrorDetails[];
      const newFieldErrors = { ...fieldErrors };
      errors.forEach((currError) => {
        if (currError.field === InputFields.AUTH.EMAIL) newFieldErrors.email = currError.message;
        if (currError.field === InputFields.AUTH.PASSWORD) newFieldErrors.password = currError.message;
        dispatch(setAlert(new Alert(currError.message, AlertType.DANGER)));
      });
      setFieldErrors(newFieldErrors);
    }
  }, [deleteAccountIsSuccess, deleteAccountIsError]);

  useEffect(() => {
    if (user || userQueryIsLoading) return;
    router.push("/login");
  }, [user, userQueryIsSuccess, userQueryIsLoading, userQueryIsFetching]);

  if (!user || userQueryIsLoading) return <p>...</p>;

  return (
    <>
      <Modal
        screenClass="modal-screen-dim"
        frameClass="modal-frame-dark"
        isOpen={displayDeleteAccountModal}
        setParentDisplay={setParentDisplay}
        title="Delete Account"
      >
        <p>
          WARNING: This will delete your account, including all profile and ranking info. If you are certain of your decision, type your email address into the
          input and click Confirm Delete.
        </p>
        <form onSubmit={(e) => handleSubmitDeleteAccount(e)}>
          <LabeledTextInputWithErrorDisplay
            name={InputFields.AUTH.EMAIL}
            type="email"
            label="Email Address"
            placeholder="Email"
            value={email}
            onChange={onChange}
            disabled={deleteAccountIsLoading}
            error={fieldErrors.email}
            autofocus
          />
          <LabeledTextInputWithErrorDisplay
            name={InputFields.AUTH.PASSWORD}
            type="password"
            label="Password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            disabled={deleteAccountIsLoading}
            error={fieldErrors.password}
            autofocus={false}
          />
          <button type="submit" className="button button-standard-size button-danger modal-submit-button" disabled={deleteAccountIsLoading}>
            {deleteAccountIsLoading ? "..." : ButtonNames.AUTH_FORMS.DELETE_ACCOUNT}
          </button>
        </form>
      </Modal>
      <div className="page-frame">
        <ul className="page-basic">
          <h1 className="header-basic">SETTINGS </h1>
          <div className="page-divider-line" />
          <li>
            <span>{userQueryIsLoading ? "..." : userQueryIsSuccess ? `Logged in as ${accountEmail}` : `failed to fetch user data`}</span>
          </li>
          <li>
            <button type="button" className="link-simple" onClick={handleRequestChangePasswordEmail} disabled={passwordResetIsLoading}>
              {passwordResetIsLoading ? "Senging email..." : "Change Password"}
            </button>
          </li>
          <li>
            <button type="button" className="link-simple" onClick={showDeleteAccountModal} disabled={deleteAccountIsLoading}>
              {deleteAccountIsLoading ? "..." : "Delete Account"}
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Settings;
