import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux";
import { AlertType } from "../../enums";
import { Alert } from "../../classes/Alert";
import { setAlert } from "../../redux/slices/alerts-slice";
import { useRegisterUserMutation } from "../../redux/api-slices/auth-api-slice";
import { useRouter } from "next/router";
import Link from "next/link";
import { RegisterInput } from "../../redux/types";
import Cookies from "js-cookie";
import { userApi } from "../../redux/api-slices/user-api-slice";

const Register = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [registerUser, { isLoading: registerUserIsLoading, isSuccess: registerUserIsSuccess, error, isError }] =
    useRegisterUserMutation();
  const [formData, setFormData] = useState<RegisterInput>({
    email: "",
    name: "",
    password: "",
    password2: "",
  });

  const { email, password, password2, name } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== password2) dispatch(setAlert(new Alert("Passwords do not match.", AlertType.DANGER)));
    else {
      try {
        const res = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password2: formData.password2,
        });
      } catch (error) {
        console.log(error);
        dispatch(setAlert(new Alert("Error creating account", AlertType.DANGER)));
      }
    }
  };

  useEffect(() => {
    if (registerUserIsSuccess || (Cookies.get("logged_in") && !redirecting)) {
      setRedirecting(true);
      router.push("/battle-room");
    }
  });

  return (
    <div className="auth-frame">
      <h1 className="auth-brand-header">Lucella.org</h1>
      <h3 className="auth-header">Create Account</h3>
      <form className="auth-form" onSubmit={(e) => submitHandler(e)}>
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
          <Link href="/login">Log in to existing account</Link>
          <input type="submit" className="button button-standard-size button-primary" value="CREATE" />
        </div>
      </form>
    </div>
  );
};

export default Register;
