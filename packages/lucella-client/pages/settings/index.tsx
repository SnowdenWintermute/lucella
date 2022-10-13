import { useRouter } from "next/router";
import React, { useState, useEffect, Fragment } from "react";
import FlashingClickableText from "../../components/common/FlashingClickableText";
import Modal from "../../components/common/modal/Modal";
import { useAppSelector } from "../../redux";
// import { useDeleteAccountMutation, useRequestPasswordResetEmailMutation } from "../../redux/api-slices/auth-api-slice";

const Settings = () => {
  const router = useRouter();
  // const [deleteAccount] = useDeleteAccountMutation();
  // const [requestPasswordResetEmail, { isLoading, isSuccess, error, isError }] = useRequestPasswordResetEmailMutation();
  const [displayDeleteAccountModal, setDisplayDeleteAccountModal] = useState(false);
  const [email, setEmail] = useState("");

  // const accountEmail = session?.user?.email ? session.user.email : "...";

  // MODAL - must pass function to modal so the modal can send props back to parent and set display to false from within modal component
  const setParentDisplay = (status: boolean) => {
    setDisplayDeleteAccountModal(status);
  };
  const showDeleteAccountModal = () => {
    setDisplayDeleteAccountModal(true);
  };

  // DELETE ACCOUNT FORM
  // const onSubmitDeleteAccount = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   deleteAccount(email);
  // };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  if (status === "loading" || status === "unauthenticated") return <p>...</p>;

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
        <form onSubmit={(e) => /* onSubmitDeleteAccount(e)*/ console.log(e)}>
          <input
            className="simple-text-input"
            onChange={(e) => onChange(e)}
            placeholder="Email"
            name="email"
            value={email}
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
            <span>Logged in as {"accountEmail"}</span>
          </li>
          <li>
            {
              /*emailResetIsLoading*/ false ? (
                <span>loading...</span>
              ) : (
                <FlashingClickableText
                  onClick={function () {
                    console.log("clicked");
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
