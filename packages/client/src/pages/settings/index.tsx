/* eslint-disable no-nested-ternary */
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRequestPasswordResetEmailMutation } from "../../redux/api-slices/auth-api-slice";
import { useAppDispatch } from "../../redux/hooks";
import { setAlert } from "../../redux/slices/alerts-slice";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
import { useDeleteAccountMutation, useGetMeQuery } from "../../redux/api-slices/users-api-slice";
import { ERROR_MESSAGES, SUCCESS_ALERTS } from "../../../../common";
import DeleteAccountModal from "../../components/settings-page/DeleteAccountModal";
import { APP_TEXT } from "../../consts/app-text";
import BattleRoomGameSettings from "./BattleRoomGameSettings";

function Settings() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [deleteAccount, { isLoading: deleteAccountIsLoading }] = useDeleteAccountMutation();
  const [requestPasswordResetEmail, { isLoading: passwordResetIsLoading, isSuccess: passwordResetIsSuccess, isError: passwordResetIsError }] =
    useRequestPasswordResetEmailMutation();
  const {
    data: user,
    isLoading: userQueryIsLoading,
    isSuccess: userQueryIsSuccess,
    isFetching: userQueryIsFetching,
  } = useGetMeQuery(null, { refetchOnMountOrArgChange: true });

  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const accountEmail = user?.email ? user.email : "...";

  const handleRequestChangePasswordEmail = async () => {
    await requestPasswordResetEmail(accountEmail);
  };

  useEffect(() => {
    if (passwordResetIsSuccess) dispatch(setAlert(new Alert(SUCCESS_ALERTS.AUTH.CHANGE_PASSWORD_EMAIL_SENT, AlertType.SUCCESS)));
    if (passwordResetIsError) dispatch(setAlert(new Alert(ERROR_MESSAGES.AUTH.CHANGE_PASSWORD_EMAIL, AlertType.DANGER)));
  }, [passwordResetIsSuccess, passwordResetIsError]);

  useEffect(() => {
    if (user || userQueryIsLoading) return;
    router.push("/login");
  }, [user, userQueryIsSuccess, userQueryIsLoading, userQueryIsFetching]);

  if (!user || userQueryIsLoading) return <p>...</p>;

  return (
    <section className="page-padded-container">
      <main className="page">
        <div className="page__top-bar">
          <h3 className="page__header">{APP_TEXT.SETTINGS.TITLE}</h3>
        </div>
        <div className="settings-page__content">
          <h3>User account settings</h3>
          <div className="settings-page__options-and-email">
            <span className="settings-page__logged-in-as-email">
              {userQueryIsLoading ? "..." : userQueryIsSuccess ? `Logged in as ${accountEmail}` : `failed to fetch user data`}
            </span>
            <ul className="settings-page__options">
              <li>
                <button type="button" className="button " onClick={handleRequestChangePasswordEmail} disabled={passwordResetIsLoading}>
                  {passwordResetIsLoading ? "Senging email..." : APP_TEXT.SETTINGS.CHANGE_PASSWORD}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="button button--danger settings-page__delete-account-button"
                  aria-controls="Delete Account modal"
                  aria-expanded={showDeleteAccountModal}
                  onClick={() => setShowDeleteAccountModal(true)}
                  disabled={deleteAccountIsLoading}
                >
                  {deleteAccountIsLoading ? "..." : APP_TEXT.SETTINGS.DELETE_ACCOUNT}
                </button>
                {showDeleteAccountModal && <DeleteAccountModal user={user} setParentDisplay={setShowDeleteAccountModal} />}
              </li>
            </ul>
          </div>
          <BattleRoomGameSettings />
        </div>
      </main>
    </section>
  );
}

export default Settings;
