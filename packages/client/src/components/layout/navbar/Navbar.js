import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserMenu } from "./UserMenu";
// img
import logo from "../../../img/logo.png";
import { ReactComponent as GamesIcon } from "../../../img/menuIcons/queen.svg";
import { ReactComponent as LadderIcon } from "../../../img/menuIcons/podium.svg";
import { ReactComponent as ForumIcon } from "../../../img/menuIcons/discussion.svg";
import { useEffect } from "react";
import { useHistory } from 'react-router-dom'
const Navbar = () => {
  const history = useHistory()
  const { pathname } = history.location
  // state
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const gameStatus = useSelector((state) => state.gameUi.gameStatus); // used to hide navbar in game

  return (
    gameStatus !== "inProgress" &&
    gameStatus !== "ending" && (
      <Fragment>
        <nav className="nav">
          {/* Nav tabs */}
          <div className="nav-right-holder">
            <img className="logo-img" alt="lucella logo" src={logo} />
            <Link
              to="/"
              className="brand-text"
              name="landing"
            >
              <h1>Lucella.org</h1>
            </Link>
            <div className="nav-tabs">
              <Link
                to="/battle-room"
                className={`nav-tab ${pathname === "/battle-room" && "tab-active"}`}
                name="games"
              >
                <span className="tab-title-text">GAME</span>
                <GamesIcon className="tab-icon-svg" />
              </Link>
              <Link
                to="/ladder"
                className={`nav-tab ${pathname === "/ladder" && "tab-active"}`}
                name="ladder"
              >
                <span className="tab-title-text">LADDER</span>
                <LadderIcon className="tab-icon-svg" />
              </Link>
              {/* <Link
                to="/forum"
                className={`nav-tab ${pathname === "/forum" && "tab-active"}`}
                name="forum"
              >
                <span className="tab-title-text">FORUM</span>
                <ForumIcon className="tab-icon-svg" />
              </Link> */}
            </div>
          </div>
          {/* User menu */}
          <div className="user-menu-holder">
            {!loading ? (
              <UserMenu
                isAuthenticated={isAuthenticated}
              />
            ) : (
                "..."
              )}
          </div>
        </nav>
        <div className="nav-tab-thin-bar"></div>
      </Fragment>
    )
  );
};

export default Navbar;
