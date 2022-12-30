/* eslint-disable no-nested-ternary */
import { useRouter } from "next/router";
import React, { useState, useEffect, Fragment } from "react";
import Modal from "../../components/common-components/modal/Modal";
import { authApi, useRequestPasswordResetEmailMutation } from "../../redux/api-slices/auth-api-slice";
import { useAppDispatch } from "../../redux/hooks";
import { setAlert } from "../../redux/slices/alerts-slice";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import { useDeleteAccountMutation, usersApi } from "../../redux/api-slices/users-api-slice";
import { ErrorMessages, SuccessAlerts } from "../../../common";

function Settings() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [redirecting, setRedirecting] = useState(false);
  const [deleteAccount, { isLoading: deleteAccountIsLoading, isSuccess: deleteAccountIsSuccess, isError: deleteAccountIsError, error: deleteAccountError }] =
    useDeleteAccountMutation();
  const [
    requestPasswordResetEmail,
    { isLoading: passwordResetIsLoading, isSuccess: passwordResetIsSuccess, isError: passwordResetIsError, error: passwordResetError },
  ] = useRequestPasswordResetEmailMutation();
  const [displayDeleteAccountModal, setDisplayDeleteAccountModal] = useState(false);
  const [email, setEmail] = useState("");
  const {
    data: userState,
    isLoading: userQueryIsLoading,
    isSuccess: userQueryIsSuccess,
    isFetching: userQueryIsFetching,
  } = usersApi.endpoints.getMe.useQuery(null, { refetchOnMountOrArgChange: true });
  const accountEmail = userState?.email ? userState.email : "...";

  // MODAL - must pass function to modal so the modal can send props back to parent and set display to false from within modal component
  const setParentDisplay = (status: boolean) => {
    setDisplayDeleteAccountModal(status);
  };
  const showDeleteAccountModal = () => {
    setDisplayDeleteAccountModal(true);
  };

  const handleRequestChangePasswordEmail = async () => {
    await requestPasswordResetEmail(accountEmail);
    if (passwordResetIsSuccess) dispatch(setAlert(new Alert(SuccessAlerts.AUTH.CHANGE_PASSWORD_EMAIL_SENT, AlertType.SUCCESS)));
    if (passwordResetIsError) {
      console.log(passwordResetError);
      dispatch(setAlert(new Alert("placeholder", AlertType.DANGER)));
    }
  };

  const handleSubmitDeleteAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email !== userState?.email) dispatch(setAlert(new Alert(ErrorMessages.VALIDATION.AUTH.CONFIRM_DELETE_ACCOUNT_EMAIL_MATCH, AlertType.DANGER)));
    else {
      await deleteAccount(email);
      if (deleteAccountIsSuccess) dispatch(setAlert(new Alert(SuccessAlerts.USERS.ACCOUNT_DELETED, AlertType.SUCCESS)));
      await dispatch(authApi.util.resetApiState());
      if (deleteAccountIsError) {
        console.log(deleteAccountError);
        dispatch(setAlert(new Alert("placeholder", AlertType.DANGER)));
      }
    }
  };

  useEffect(() => {
    if (!deleteAccountIsSuccess) return;
    setRedirecting(true);
    router.push("/register");
  }, [deleteAccountIsSuccess]);

  useEffect(() => {
    if (userQueryIsSuccess || userQueryIsLoading || userQueryIsFetching || redirecting) return;
    setRedirecting(true);
    router.push("/login");
  }, [userQueryIsSuccess, userQueryIsLoading, userQueryIsFetching]);

  if (!userQueryIsSuccess || userQueryIsLoading || userQueryIsFetching) return <p>...</p>;

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
          <input className="simple-text-input" onChange={(e) => setEmail(e.target.value)} placeholder="Email" name="email" value={email} autoFocus />
          <button type="submit" className="button button-standard-size button-danger modal-submit-button" disabled={deleteAccountIsLoading}>
            Confirm Delete
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
