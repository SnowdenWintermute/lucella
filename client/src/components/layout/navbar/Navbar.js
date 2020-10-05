import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { UserMenu } from "./UserMenu";
// img
import logo from "../../../img/logo.png";
import { ReactComponent as GamesIcon } from "../../../img/menuIcons/queen.svg";
import { ReactComponent as LadderIcon } from "../../../img/menuIcons/podium.svg";
import { ReactComponent as ForumIcon } from "../../../img/menuIcons/discussion.svg";
import Forum from "../../pages/forum/Forum";

const Navbar = ({ auth: { isAuthenticated, loading } }) => {
  // state
  const [activeTab, setActiveTab] = useState(null);
  const [mobileViewActive, setMobileViewActive] = useState(false);
  const [tinyViewActive, setTinyViewActive] = useState(false);
  const gameStatus = useSelector((state) => state.gameUi.gameStatus);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // effects

  useEffect(() => {
    setWindowWidth(window.innerWidth);
  }, [windowWidth, setWindowWidth]);

  useEffect(() => {
    if (windowWidth < 786) setMobileViewActive(true);
    else setMobileViewActive(false);
    if (windowWidth < 450) setTinyViewActive(true);
    else setTinyViewActive(false);
  }, [setMobileViewActive, setTinyViewActive, windowWidth]);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      console.log(windowWidth);
      if (windowWidth < 786) setMobileViewActive(true);
      else setMobileViewActive(false);
      if (windowWidth < 450) setTinyViewActive(true);
      else setTinyViewActive(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setMobileViewActive, setTinyViewActive, setWindowWidth, windowWidth]);

  // functions

  // tabs
  const onNavItemClick = (e, name) => {
    if (e.target.name) setActiveTab(e.target.name);
    else setActiveTab(name);
  };

  return (
    gameStatus !== "inProgress" &&
    gameStatus !== "ending" &&
    (mobileViewActive ? (
      // MOBILE VIEW
      <Fragment>
        <nav className={"nav nav-mobile"}>
          <div className="nav-tabs">
            <Link
              to="/"
              className="nav-logo-mobile"
              name="landing"
              onClick={(e) => onNavItemClick(e)}
            >
              <img className="logo-img" alt="lucella logo" src={logo} />
            </Link>
            <Link
              to="/games"
              className={`nav-tab nav-tab-mobile ${
                activeTab === "games" && "tab-active"
              }`}
              name="games"
              onClick={(e) => onNavItemClick(e, "games")}
            >
              {tinyViewActive ? (
                <GamesIcon className="tab-icon-svg" />
              ) : (
                "GAMES"
              )}
            </Link>
            <Link
              to="/ladder"
              className={`nav-tab nav-tab-mobile ${
                activeTab === "ladder" && "tab-active"
              }`}
              name="ladder"
              onClick={(e) => onNavItemClick(e, "ladder")}
            >
              {tinyViewActive ? (
                <LadderIcon className="tab-icon-svg" />
              ) : (
                "LADDER"
              )}
            </Link>
            <Link
              to="/forum"
              className={`nav-tab nav-tab-mobile ${
                activeTab === "forum" && "tab-active"
              }`}
              name="forum"
              onClick={(e) => onNavItemClick(e, "forum")}
            >
              {tinyViewActive ? (
                <ForumIcon className="tab-icon-svg" />
              ) : (
                "FORUM"
              )}
            </Link>
          </div>
          <ul className="user-menu-holder">
            {!loading ? (
              <UserMenu
                isAuthenticated={isAuthenticated}
                onNavItemClick={onNavItemClick}
              />
            ) : (
              "..."
            )}
          </ul>
        </nav>
        <div className="nav-tab-thin-bar"></div>
      </Fragment>
    ) : (
      // DESKTOP VIEW
      <Fragment>
        <nav className="nav">
          <div className="nav-right-holder">
            <img className="logo-img" alt="lucella logo" src={logo} />
            <h1>
              <Link
                to="/"
                className="brand-text"
                name="landing"
                onClick={(e) => onNavItemClick(e)}
              >
                Lucella.org
              </Link>
            </h1>
            <div className="nav-tabs">
              <Link
                to="/games"
                className={`nav-tab ${activeTab === "games" && "tab-active"}`}
                name="games"
                onClick={(e) => onNavItemClick(e)}
              >
                GAMES
              </Link>
              <Link
                to="/ladder"
                className={`nav-tab ${activeTab === "ladder" && "tab-active"}`}
                name="ladder"
                onClick={(e) => onNavItemClick(e)}
              >
                LADDER
              </Link>
              <Link
                to="/forum"
                className={`nav-tab ${activeTab === "forum" && "tab-active"}`}
                name="forum"
                onClick={(e) => onNavItemClick(e)}
              >
                FORUM
              </Link>
            </div>
          </div>
          <ul className="user-menu-holder">
            {!loading ? (
              <UserMenu
                isAuthenticated={isAuthenticated}
                onNavItemClick={onNavItemClick}
              />
            ) : (
              "..."
            )}
          </ul>
        </nav>
        <div className="nav-tab-thin-bar"></div>
      </Fragment>
    ))
  );
};

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Navbar);
