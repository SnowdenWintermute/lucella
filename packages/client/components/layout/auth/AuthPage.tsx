import React, { FormEvent } from "react";
import styles from "./auth.module.scss";

type Props = {
  title: string;
  children: JSX.Element | JSX.Element[];
  submitHandler: (e: FormEvent<HTMLFormElement>) => void;
};

export default function AuthPage({ children, submitHandler, title }: Props) {
  return (
    <div className={styles["auth-frame"]}>
      <h1 className={styles["auth-brand-header"]}>Lucella.org</h1>
      <h3 className={styles["auth-header"]}>{title}</h3>
      <form className={styles["auth-form"]} onSubmit={(e) => submitHandler(e)}>
        {children}
      </form>
    </div>
  );
}
