import React, { useState, Fragment } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { requestPasswordResetEmail, deleteAccount } from "../../../store/actions/auth";
import FlashingClickableText from "../../common/FlashingClickableText";
import Modal from "../../common/modal/Modal";

const Settings = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const { user } = authState;
  const [displayDeleteAccountModal, setDisplayDeleteAccountModal] = useState(false);
  const [email, setEmail] = useState("");

  const accountEmail = user ? user.email : "...";

  // MODAL - must pass function to modal so the modal can send props back to parent and set display to false from within modal component
  const setParentDisplay = (status: boolean) => {
    setDisplayDeleteAccountModal(status);
  };
  const showDeleteAccountModal = () => {
    setDisplayDeleteAccountModal(true);
  };

  // DELETE ACCOUNT FORM
  const onSubmitDeleteAccount = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    deleteAccount(email);
  };
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

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
        <form onSubmit={(e) => onSubmitDeleteAccount(e)}>
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
            <span>Logged in as {accountEmail}</span>
          </li>
          <li>
            <FlashingClickableText
              onClick={function () {
                requestPasswordResetEmail(accountEmail);
              }}
            >
              Change Password
            </FlashingClickableText>
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
