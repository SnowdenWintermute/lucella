import React, { Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../actions/auth";

const Login = ({ isAuthenticated, login, alerts }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const { email, password } = formData;
    login({ email, password });
  };

  // redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/games"></Redirect>;
  }

  console.log(alerts);

  return (
    <div className="login-frame">
      <h1 className="login-brand-header">Lucella.org</h1>
      <h3 className="login-header">Sign In</h3>
      <form className="login-form" onSubmit={e => onSubmit(e)}>
        <input
          className="login-text-input"
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={e => onChange(e)}
        ></input>
        <input
          className="login-text-input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={e => onChange(e)}
        ></input>
        <div className="forgot-password">Forgot password?</div>
        <div className="login-bottom-links">
          <Link to="/register">Create account</Link>
          <input type="submit" className="button button-primary" value="SIGN" />
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  alerts: state.alert
});

export default connect(mapStateToProps, { login })(Login);
