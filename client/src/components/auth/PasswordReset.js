import React, { useState } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../actions/alert";
import { resetPassword } from "../../actions/auth";
import PropTypes from "prop-types";

const PasswordReset = ({ setAlert, resetPassword, isAuthenticated, match }) => {
  const [formData, setFormData] = useState({
    password: "",
    password2: ""
  });

  const { password, password2 } = formData;
  const token = match.params.token;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (/*password !== password2*/ false) {
      setAlert("Passwords do not match.", "danger");
    } else {
      resetPassword({
        password,
        password2,
        token
      });
    }
  };

  // redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/games"></Redirect>;
  }

  return (
    <div className="auth-frame">
      <h1 className="auth-brand-header">Lucella.org</h1>
      <h3 className="auth-header">Reset Password</h3>
      <form className="auth-form" onSubmit={e => onSubmit(e)}>
        <input
          className="auth-text-input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={e => onChange(e)}
        ></input>
        <input
          className="auth-text-input"
          type="password"
          name="password2"
          placeholder="Password2"
          value={password2}
          onChange={e => onChange(e)}
        ></input>
        <div className="auth-bottom-links">
          <Link to="/login">Log in to existing account</Link>
          <input type="submit" className="button button-primary" value="SET" />
        </div>
      </form>
    </div>
  );
};

PasswordReset.propTypes = {
  setAlert: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, resetPassword })(
  PasswordReset
);
