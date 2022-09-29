import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Fragment } from "react";
import logoutIcon from "../../../img/menuIcons/logout.png";
import SettingsIcon from "../../../img/menuIcons/settings.svg";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { logout } from "../../../redux/slices/auth-slice";

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
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
          <Link href="/settings" className="user-menu-item">
            <>
              <SettingsIcon className="menu-icon-svg" />
              Settings
            </>
          </Link>
          <Link
            href="/login"
            className="user-menu-item"
            onClick={(e) => {
              dispatch(logout());
            }}
          >
            <>
              <Image alt="logout icon" src={logoutIcon} />
              Logout
            </>
          </Link>
        </ul>
      )}
    </Fragment>
  );

  const guestMenu = (
    <Link href="/login" className="button button-standard-size button-basic">
      LOGIN
    </Link>
  );

  const userMenu = isAuthenticated ? loggedInUserMenu : guestMenu;

  return userMenu;
};
