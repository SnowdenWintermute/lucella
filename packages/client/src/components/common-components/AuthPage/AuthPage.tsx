import React, { FormEvent } from "react";
// import styles from "./auth.module.scss";

type Props = {
  title: string;
  children: JSX.Element | JSX.Element[];
  submitHandler: (e: FormEvent<HTMLFormElement>) => void;
};

export default function AuthPage({ children, submitHandler, title }: Props) {
  return (
    <div className="auth-page">
      <h3 className="auth-page__page-title">{title}</h3>
      <form className="auth-page__form" onSubmit={(e) => submitHandler(e)}>
        {children}
      </form>
    </div>
  );
}
