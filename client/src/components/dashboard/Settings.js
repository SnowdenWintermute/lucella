import React, { useState, Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  requestPasswordResetEmail,
  deleteAccount,
} from "../../store/actions/auth";
import FlashingClickableText from "../common/FlashingClickableText";
import Modal from "../common/modal/Modal";

// import { ReactComponent as SettingsIcon } from "../../img/menuIcons/settings.svg";

const Settings = ({
  auth: { user },
  requestPasswordResetEmail,
  deleteAccount,
  history,
}) => {
  const [displayDeleteAccountModal, setDisplayDeleteAccountModal] = useState(
    false,
  );
  const [email, setEmail] = useState("");

  const accountEmail = user ? user.email : "...";

  // MODAL - must pass function to modal so the modal can send props back to parent and set display to false from within modal component
  const setParentDisplay = (status) => {
    setDisplayDeleteAccountModal(status);
  };
  const showDeleteAccountModal = () => {
    setDisplayDeleteAccountModal(true);
  };

  // DELETE ACCOUNT FORM
  const onSubmitDeleteAccount = (e) => {
    e.preventDefault();
    deleteAccount({ email });
  };
  const onChange = (e) => {
    setEmail(e.target.value);
  };

  // RETURN
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
          WARNING: This will delete your account, including all profile and
          ranking info. If you are certain of your decision, type your email
          address into the input and click Confirm Delete.
        </p>
        <form onSubmit={(e) => onSubmitDeleteAccount(e)}>
          <input
            className="simple-text-input"
            onChange={(e) => onChange(e)}
            placeholder="Email"
            name="email"
            value={email}
          ></input>
          <button
            className="button button-standard-size button-danger modal-submit-button"
            action="submit"
          >
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
              className="link-simple"
              onClick={function () {
                requestPasswordResetEmail({ email: accountEmail });
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

Settings.propTypes = {
  auth: PropTypes.object.isRequired,
  requestPasswordResetEmail: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  requestPasswordResetEmail,
  deleteAccount,
})(withRouter(Settings));
