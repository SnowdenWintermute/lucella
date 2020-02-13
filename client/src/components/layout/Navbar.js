import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
// img
import logo from "../../img/logo.png";
import logoutIcon from "../../img/logout.png";
import userIcon from "../../img/user.png";
import profileIcon from "../../img/profile.png";
import walletIcon from "../../img/wallet.png";

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  // state
  const [showUserDropdown, toggleUserDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  // effects
  useEffect(() => {
    window.addEventListener("click", e => {
      if (e.target.name !== "profile-icon")
        if (showUserDropdown) toggleUserDropdown(!showUserDropdown);
    });
  });
  // functions
  const loggedInUserMenu = (
    <Fragment>
      <img
        src={profileIcon}
        className="user-icon"
        name="profile-icon"
        alt="profile icon"
        onClick={() => toggleUserDropdown(!showUserDropdown)}
      />
      {showUserDropdown && (
        <ul className="user-menu">
          <Link to="/profile" className="user-menu-item">
            <img alt="user icon" src={userIcon} />
            Profile
          </Link>
          <Link to="/wallet" className="user-menu-item">
            <img alt="wallet icon" src={walletIcon} />
            Wallet
          </Link>
          <Link to="/login" className="user-menu-item" onClick={logout}>
            <img alt="logout icon" src={logoutIcon} />
            Logout
          </Link>
        </ul>
      )}
    </Fragment>
  );

  const guestMenu = (
    <Link to="/login" className="button button-basic">
      LOGIN
    </Link>
  );

  const userMenu = isAuthenticated ? loggedInUserMenu : guestMenu;

  // tabs
  const onTabClick = e => {
    setActiveTab(e.target.name);
  };

  return (
    <Fragment>
      <nav className="nav">
        <div className="nav-right-holder">
          <img className="logo-img" alt="lucella logo" src={logo} />
          <h1>
            <Link
              to="/"
              className="brand-text"
              name="landing"
              onClick={e => onTabClick(e)}
            >
              Lucella.org
            </Link>
          </h1>
          <div className="nav-tabs">
            <Link
              to="/games"
              className={`nav-tab ${activeTab === "games" && "tab-active"}`}
              name="games"
              onClick={e => onTabClick(e)}
            >
              GAMES
            </Link>
            <Link
              to="/ladder"
              className={`nav-tab ${activeTab === "ladder" && "tab-active"}`}
              name="ladder"
              onClick={e => onTabClick(e)}
            >
              LADDER
            </Link>
            <Link
              to="/forum"
              className={`nav-tab ${activeTab === "forum" && "tab-active"}`}
              name="forum"
              onClick={e => onTabClick(e)}
            >
              FORUM
            </Link>
          </div>
        </div>
        <ul className="user-menu-holder">{!loading ? userMenu : "..."}</ul>
      </nav>
      <div className="nav-tab-thin-bar"></div>
    </Fragment>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);