import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { requestPasswordResetEmail } from "../../actions/auth";

const RequestPasswordResetEmail = ({
  isAuthenticated,
  requestPasswordResetEmail
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const { email } = formData;
    requestPasswordResetEmail({ email });
  };

  // redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/games"></Redirect>;
  }

  return (
    <div className="auth-frame">
      <h1 className="auth-brand-header">Lucella.org</h1>
      <h3 className="auth-header">Sign In</h3>
      <form className="auth-form" onSubmit={e => onSubmit(e)}>
        <input
          className="auth-text-input"
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={e => onChange(e)}
        ></input>
        <div className="forgot-password">
          Enter your email to request a password reset.
        </div>
        <div className="auth-bottom-links">
          <input type="submit" className="button button-primary" value="SEND" />
        </div>
      </form>
    </div>
  );
};

RequestPasswordResetEmail.propTypes = {
  requestPasswordResetEmail: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { requestPasswordResetEmail })(
  RequestPasswordResetEmail
);