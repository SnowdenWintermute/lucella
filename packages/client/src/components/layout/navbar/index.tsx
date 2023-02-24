import React, { Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { UserMenu } from "./UserMenu";
// import logo from "../../../img/logo.png";
import Logo from "../../../img/logo.svg";
import GamesIcon from "../../../img/menuIcons/queen.svg";
import styles from "./nav.module.scss";

function Navbar() {
  const router = useRouter();
  // eslint-disable-next-line consistent-return
  return (
    <>
      <nav className="nav">
        {/* Nav tabs */}
        <div className="nav-right-holder">
          {/* <Image className="logo-img" alt="lucella logo" src={logo} /> */}
          <Logo className={styles["site-logo"]} />
          <Link href="/" className="brand-text">
            <h1>Battle School</h1>
          </Link>
          <div className="nav-tabs">
            <Link href="/battle-room" className={`nav-tab ${router.pathname === "/battle-room" && "tab-active"}`}>
              <span className="tab-title-text">GAME</span>
              <GamesIcon className="tab-icon-svg" />
            </Link>
            <Link href="/ladder" className={`nav-tab ${router.pathname === "/ladder" && "tab-active"}`}>
              <span className="tab-title-text">LADDER</span>
            </Link>
          </div>
        </div>
        {/* User menu */}
        <div className="user-menu-holder">
          <UserMenu />
        </div>
      </nav>
      <div className="nav-tab-thin-bar" />
    </>
  );
}

export default Navbar;
