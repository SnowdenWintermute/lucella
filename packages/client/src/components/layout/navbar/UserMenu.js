import React, { useState, useEffect, Fragment } from "react";
import logoutIcon from "../../../img/menuIcons/logout.png";
// import userIcon from "../../../img/menuIcons/user.png";
import profileIcon from "../../../img/profile.png";
// import walletIcon from "../../../img/menuIcons/wallet.png";
import { ReactComponent as SettingsIcon } from "../../../img/menuIcons/settings.svg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/actions/auth";

export const UserMenu = ({ isAuthenticated }) => {
  const dispatch = useDispatch();
  const [showUserDropdown, toggleUserDropdown] = useState(false);
  const username = useSelector(
    (state) => state.auth.user && state.auth.user.name,
  );

  // show/hide menu
  useEffect(() => {
    const clearUserDropdown = (e) => {
      if (e.target.getAttribute("name") !== "profile-icon")
        toggleUserDropdown(false);
    };
    window.addEventListener("click", (e) => clearUserDropdown(e));
    return () => window.removeEventListener("click", clearUserDropdown);
  }, [showUserDropdown]);

  const loggedInUserMenu = (
    <Fragment>
      <div
        src={profileIcon}
        className="user-icon-circle"
        name="profile-icon"
        alt="profile icon"
        onClick={(e) => { toggleUserDropdown(!showUserDropdown) }}
      >
        <div className="user-icon-letter" name="profile-icon">
          {username && username.slice(0, 1)}
        </div>
      </div>
      {showUserDropdown && (
        <ul className="user-menu">
          {/* <Link
            to="/profile"
            className="user-menu-item"
          >
            <img alt="user icon" src={userIcon} />
            Profile
          </Link> */}
          {/* <Link
            to="/wallet"
            className="user-menu-item"
          >
            <img alt="wallet icon" src={walletIcon} />
            Wallet
          </Link> */}
          <Link
            to="/settings"
            className="user-menu-item"
          >
            <SettingsIcon className="menu-icon-svg"></SettingsIcon>
            Settings
          </Link>
          <Link
            to="/login"
            className="user-menu-item"
            onClick={(e) => { dispatch(logout()); }}
          >
            <img alt="logout icon" src={logoutIcon} />
            Logout
          </Link>
        </ul>
      )}
    </Fragment>
  );

  const guestMenu = (
    <Link
      to="/login"
      className="button button-standard-size button-basic">
      LOGIN
    </Link>
  );

  const userMenu = isAuthenticated ? loggedInUserMenu : guestMenu;

  return userMenu;
};
