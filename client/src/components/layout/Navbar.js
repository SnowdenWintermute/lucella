import React, { useState, Fragment } from "react";
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
  // functions
  const loggedInUserMenu = (
    <Fragment>
      <img
        src={profileIcon}
        alt="profile icon"
        onClick={() => toggleUserDropdown(!showUserDropdown)}
      />
      {showUserDropdown && (
        <ul className="user-menu">
          <li className="user-menu-item">
            <img alt="user icon" src={userIcon} />
            Profile
          </li>
          <li className="user-menu-item">
            <img alt="wallet icon" src={walletIcon} />
            Wallet
          </li>
          <li className="user-menu-item">
            <img alt="logout icon" src={logoutIcon} />
            Logout
          </li>
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

  return (
    <Fragment>
      <nav className="nav">
        <div className="nav-right-holder">
          <img className="logo-img" alt="lucella logo" src={logo} />
          <h1>
            <Link to="/" className="brand-text">
              Lucella.org
            </Link>
          </h1>
          <div className="nav-tabs">
            <Link to="/games" className="nav-tab">
              GAMES
            </Link>
            <Link to="/ladder" className="nav-tab">
              LADDER
            </Link>
            <Link to="/forum" className="nav-tab">
              FORUM
            </Link>
          </div>
        </div>
        <ul className="user-menu-holder">{userMenu}</ul>
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
