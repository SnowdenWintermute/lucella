import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Fragment } from "react";
import logoutIcon from "../../../img/menuIcons/logout.png";
import SettingsIcon from "../../../img/menuIcons/settings.svg";
import { useAppDispatch, useAppSelector } from "../../../redux";
import { useCookies } from "react-cookie";
import { useLogoutUserMutation } from "../../../redux/api-slices/auth-api-slice";

export const UserMenu = () => {
  const user = useAppSelector((state) => state.user.user);
  const [showUserMenu, setShowUserMenu] = useState<boolean | null>(null);
  const [cookies] = useCookies(["logged_in"]);
  const [showUserDropdown, toggleUserDropdown] = useState(false);
  const username = user && user.name;
  const [logoutUser, { isLoading, isSuccess, error, isError }] = useLogoutUserMutation();

  useEffect(() => {
    console.log(cookies.logged_in);
    if (cookies.logged_in) setShowUserMenu(true);
    else setShowUserMenu(false);
  }, [cookies.logged_in]);

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
          <Link href="/settings">
            <a className="user-menu-item">
              <SettingsIcon className="menu-icon-svg" />
              Settings
            </a>
          </Link>
          <Link href="/login">
            <a className="user-menu-item" onClick={(e) => logoutUser()}>
              <Image alt="logout icon" src={logoutIcon} />
              Logout
            </a>
          </Link>
        </ul>
      )}
    </Fragment>
  );

  const guestMenu = (
    <Link href="/login">
      <a className="button button-standard-size button-basic">LOGIN</a>
    </Link>
  );

  const userMenu = showUserMenu ? loggedInUserMenu : guestMenu;

  return userMenu;
};
