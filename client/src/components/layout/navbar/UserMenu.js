import React, { useState, useEffect, Fragment } from "react";
import logoutIcon from "../../../img/menuIcons/logout.png";
import userIcon from "../../../img/menuIcons/user.png";
import profileIcon from "../../../img/profile.png";
import walletIcon from "../../../img/menuIcons/wallet.png";
import { ReactComponent as SettingsIcon } from "../../../img/menuIcons/settings.svg";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/actions/auth";

export const UserMenu = ({ isAuthenticated, onNavItemClick }) => {
  const dispatch = useDispatch();
  const [showUserDropdown, toggleUserDropdown] = useState(false);

  useEffect(() => {
    const clearUserDropdown = (e) => {
      if (e.target.name !== "profile-icon")
        if (showUserDropdown) toggleUserDropdown(!showUserDropdown);
    };
    window.addEventListener("click", (e) => clearUserDropdown(e));
    return () => window.removeEventListener("click", clearUserDropdown);
  }, [showUserDropdown]);

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
          <Link
            to="/profile"
            className="user-menu-item"
            onClick={(e) => onNavItemClick(e)}
          >
            <img alt="user icon" src={userIcon} />
            Profile
          </Link>
          <Link
            to="/wallet"
            className="user-menu-item"
            onClick={(e) => onNavItemClick(e)}
          >
            <img alt="wallet icon" src={walletIcon} />
            Wallet
          </Link>
          <Link
            to="/settings"
            className="user-menu-item"
            onClick={(e) => {
              onNavItemClick(e);
            }}
          >
            <SettingsIcon className="menu-icon-svg"></SettingsIcon>
            Settings
          </Link>
          <Link
            to="/login"
            className="user-menu-item"
            onClick={(e) => {
              onNavItemClick(e);
              dispatch(logout());
            }}
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
      className="button button-standard-size button-basic"
      onClick={(e) => onNavItemClick(e)}
    >
      LOGIN
    </Link>
  );

  const userMenu = isAuthenticated ? loggedInUserMenu : guestMenu;

  return userMenu;
};
