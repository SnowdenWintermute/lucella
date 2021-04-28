import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../store/actions/auth";

const Login = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    dispatch(login({ email, password }));
  };

  // redirect if logged in
  if (isAuthenticated) {
    return <Redirect to="/battle-room"></Redirect>;
  }

  return (
    <div className="auth-frame">
      <h1 className="auth-brand-header">Lucella.org</h1>
      <h3 className="auth-header">Sign In</h3>
      <form className="auth-form" onSubmit={(e) => onSubmit(e)}>
        <input
          className="simple-text-input"
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={(e) => onChange(e)}
          autoFocus
        ></input>
        <input
          className="simple-text-input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onChange(e)}
        ></input>
        <div className="forgot-password">
          <Link to="request-password-reset">Forgot password?</Link>
        </div>
        <div className="auth-bottom-links">
          <Link to="/register">Create account</Link>
          <input
            type="submit"
            className="button button-standard-size button-primary"
            value="SIGN"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
