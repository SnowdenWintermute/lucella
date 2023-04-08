import React from "react";
import { Socket } from "socket.io-client";
import Link from "next/link";
import MainMenuButtons from "./MainMenuButtons";
import Logo from "../../../img/logo.svg";

function WelcomeDropdown() {
  return (
    <section className="lobby-menu welcome-menu">
      <div className="welcome-menu__copy-with-links">
        <p>Welcome to Battle School, a space station orbiting Earth at the 5th Lagrange Point.</p>
        <p>Create an account to have your name listed on the ladder, or play a casual game to learn the rules before entering the competition.</p>
        <div className="welcome-menu__links">
          <Link href="/login" className={`button ${"welcome-menu__link"}`}>
            Login
          </Link>
          <Link href="/register" className="button button--accent welcome-menu__link">
            Create Account
          </Link>
        </div>
      </div>
      <Logo className="welcome-menu__logo" />
      <span className="welcome-menu__version">alpha 0.2.0</span>
    </section>
  );
}

function MainMenu({ socket }: { socket: Socket }) {
  return (
    <>
      <ul className="lobby-menus__top-buttons">
        <MainMenuButtons socket={socket} />
      </ul>
      <WelcomeDropdown />
    </>
  );
}

export default MainMenu;