import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useState, useEffect, Fragment } from "react";
import FlashingClickableText from "../../components/common/FlashingClickableText";
import Modal from "../../components/common/modal/Modal";
import { userApi } from "../../redux/api-slices/user-api-slice";
import { useDeleteAccountMutation } from "../../redux/api-slices/auth-api-slice";
import { useAppDispatch } from "../../redux";
import { setAlert } from "../../redux/slices/alerts-slice";
import { Alert } from "../../classes/Alert";
import { AlertType } from "../../enums";
// useRequestPasswordResetEmailMutation
const Settings = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [redirecting, setRedirecting] = useState(false);
  const [deleteAccount] = useDeleteAccountMutation();
  // const [requestPasswordResetEmail, { isLoading, isSuccess, error, isError }] = useRequestPasswordResetEmailMutation();
  const [displayDeleteAccountModal, setDisplayDeleteAccountModal] = useState(false);
  const [email, setEmail] = useState("");
  const { data: userState, isLoading, isSuccess, isFetching } = userApi.endpoints.getMe.useQueryState(null);
  const accountEmail = userState?.email ? userState.email : "...";

  // MODAL - must pass function to modal so the modal can send props back to parent and set display to false from within modal component
  const setParentDisplay = (status: boolean) => {
    setDisplayDeleteAccountModal(status);
  };
  const showDeleteAccountModal = () => {
    setDisplayDeleteAccountModal(true);
  };

  const handleSubmitDeleteAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email !== userState?.email)
      dispatch(setAlert(new Alert("Email address typed did not match your account's email", AlertType.DANGER)));
    else {
      deleteAccount(email);
      router.push("/register");
    }
  };

  useEffect(() => {
    if (!isSuccess && !isLoading && !isFetching && !redirecting) {
      setRedirecting(true);
      router.push("/login");
    }
  }, [isSuccess, isLoading, isFetching]);

  if (!isSuccess || isLoading || isFetching) return <p>...</p>;

  return (
    <Fragment>
      <Modal
        screenClass="modal-screen-dim"
        frameClass="modal-frame-dark"
        isOpen={displayDeleteAccountModal}
        setParentDisplay={setParentDisplay}
        title={"Delete Account"}
      >
        <p>
          WARNING: This will delete your account, including all profile and ranking info. If you are certain of your
          decision, type your email address into the input and click Confirm Delete.
        </p>
        <form onSubmit={(e) => handleSubmitDeleteAccount(e)}>
          <input
            className="simple-text-input"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            name="email"
            value={email}
            autoFocus
          ></input>
          {/* @ts-ignore */}
          <button className="button button-standard-size button-danger modal-submit-button" action="submit">
            Confirm Delete
          </button>
        </form>
      </Modal>
      <div className="page-frame">
        <ul className="page-basic">
          <h1 className="header-basic">SETTINGS </h1>
          <div className="page-divider-line"></div>
          <li>
            <span>{!isSuccess ? "..." : "Logged in as " + accountEmail}</span>
          </li>
          <li>
            {
              /*emailResetIsLoading*/ false ? (
                <span>loading...</span>
              ) : (
                <FlashingClickableText
                  onClick={function () {
                    // requestPasswordResetEmail(accountEmail);
                  }}
                >
                  Change Password
                </FlashingClickableText>
              )
            }
          </li>
          <li>
            <div className="link-simple" onClick={showDeleteAccountModal}>
              Delete Account
            </div>
          </li>
        </ul>
      </div>
    </Fragment>
  );
};

export default Settings;
