import React from "react";
import Link from "next/link";
import lobbyMenusStyles from "./lobby-menus.module.scss";
import Logo from "../../../img/logo.svg";
import styles from "./welcome-dropdown.module.scss";

function WelcomeDropdown() {
  return (
    <section className={`${lobbyMenusStyles["lobby-menus__menu"]} ${styles["welcome-dropdown"]}`}>
      <div className={styles["welcome-dropdown__copy-with-links"]}>
        <p>Welcome to Battle School, a space station orbiting Earth at the 5th Lagrange Point.</p>
        <p>Create an account to have your name listed on the ladder, or play a casual game to learn the rules before entering the competition.</p>
        <div className={styles["welcome-dropdown__links"]}>
          <Link href="/login" className={`button ${styles["welcome-dropdown__link"]}`}>
            Login
          </Link>
          <Link href="/register" className={`button button--accent ${styles["welcome-dropdown__link"]}`}>
            Create Account
          </Link>
        </div>
      </div>
      <Logo className={styles["welcome-dropdown__logo"]} />
      <span className={styles["welcome-dropdown__version"]}>alpha 0.1.0</span>
    </section>
  );
}

export default WelcomeDropdown;
