import React, { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { AlertType } from "../../../enums";
import { setAlert } from "../../../store/actions/alert";
import { resetPassword } from "../../../store/actions/auth";

interface Props {
  match: { params: { token: string } };
}

const PasswordReset = ({ match }: Props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [formData, setFormData] = useState({
    password: "",
    password2: "",
  });

  const { password, password2 } = formData;
  const token = match.params.token;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== password2) {
      dispatch(setAlert("Passwords do not match.", AlertType.DANGER));
    } else {
      dispatch(resetPassword(password, password2, token, history));
    }
  };

  return (
    <div className="auth-frame">
      <h1 className="auth-brand-header">Lucella.org</h1>
      <h3 className="auth-header">Reset Password</h3>
      <form className="auth-form" onSubmit={(e) => onSubmit(e)}>
        <input
          className="simple-text-input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => onChange(e)}
          autoFocus
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
          <input type="submit" className="button button-standard-size button-primary" value="SET" />
        </div>
      </form>
    </div>
  );
};

export default PasswordReset;
