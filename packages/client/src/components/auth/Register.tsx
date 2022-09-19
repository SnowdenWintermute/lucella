import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { setAlert } from "../../store/actions/alert";
import { register } from "../../store/actions/auth";
import { RootState } from "../../store";
import { AlertType } from "../../enums";

const Register = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const { isAuthenticated } = authState;
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    password2: "",
  });

  const { email, password, password2, name } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== password2) setAlert("Passwords do not match.", AlertType.DANGER);
    else register(name, email, password);
  };

  // @ts-ignore
  if (isAuthenticated) return <Redirect to="/battle-room" />;

  return (
    <div className="auth-frame">
      <h1 className="auth-brand-header">Lucella.org</h1>
      <h3 className="auth-header">Create Account</h3>
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
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={(e) => onChange(e)}
        ></input>
        <input
          className="simple-text-input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onChange(e)}
        ></input>
        <input
          className="simple-text-input"
          type="password"
          name="password2"
          placeholder="Password2"
          value={password2}
          onChange={(e) => onChange(e)}
        ></input>
        <div className="auth-bottom-links">
          <Link to="/login">Log in to existing account</Link>
          <input type="submit" className="button button-standard-size button-primary" value="CREATE" />
        </div>
      </form>
    </div>
  );
};

export default Register;
