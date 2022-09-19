import React, { useState, useEffect, Fragment } from "react";
import logoutIcon from "../../../img/menuIcons/logout.png";
import { ReactComponent as SettingsIcon } from "../../../img/menuIcons/settings.svg";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/actions/auth";
import { RootState } from "../../../store";

export const UserMenu = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);
  const { isAuthenticated, user } = authState;
  const [showUserDropdown, toggleUserDropdown] = useState(false);
  const username = user && user.name;

  // show/hide menu
  useEffect(() => {
    const clearUserDropdown = (e: MouseEvent) => {
      const node = e.target as HTMLElement;
      if (node.getAttribute("data-name") !== "profile-icon") toggleUserDropdown(false);
    };
    window.addEventListener("click", (e) => clearUserDropdown(e));
    return () => window.removeEventListener("click", clearUserDropdown);
  }, [showUserDropdown]);

  const loggedInUserMenu = (
    <Fragment>
      <div
        className="user-icon-circle"
        data-name="profile-icon"
        onClick={(e) => {
          toggleUserDropdown(!showUserDropdown);
        }}
      >
        <div className="user-icon-letter" data-name="profile-icon">
          {username && username.slice(0, 1)}
        </div>
      </div>
      {showUserDropdown && (
        <ul className="user-menu">
          <Link to="/settings" className="user-menu-item">
            <SettingsIcon className="menu-icon-svg"></SettingsIcon>
            Settings
          </Link>
          <Link
            to="/login"
            className="user-menu-item"
            onClick={(e) => {
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
    <Link to="/login" className="button button-standard-size button-basic">
      LOGIN
    </Link>
  );

  const userMenu = isAuthenticated ? loggedInUserMenu : guestMenu;

  return userMenu;
};
