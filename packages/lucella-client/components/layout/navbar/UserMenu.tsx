import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, Fragment } from "react";
import logoutIcon from "../../../img/menuIcons/logout.png";
import SettingsIcon from "../../../img/menuIcons/settings.svg";
import { useLogoutUserMutation } from "../../../redux/api-slices/auth-api-slice";

export const UserMenu = () => {
  const [showUserDropdown, toggleUserDropdown] = useState(false);
  const [logoutUser, { isLoading, isSuccess, error, isError }] = useLogoutUserMutation();

  // show/hide menu
  useEffect(() => {
    const clearUserDropdown = (e: MouseEvent) => {
      const node = e.target as HTMLElement;
      if (node.getAttribute("data-name") !== "profile-icon") toggleUserDropdown(false);
    };
    window.addEventListener("click", (e) => clearUserDropdown(e));
    return () => window.removeEventListener("click", clearUserDropdown);
  }, [showUserDropdown]);

  const handleLogout = () => {
    logoutUser();
    // signOut({ callbackUrl: "/login" });
  };

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
          {/* {session?.user?.name && session.user.name.slice(0, 1)} */}
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
            <a className="user-menu-item" onClick={(e) => handleLogout()}>
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

  // if (status === "loading") return <p>...</p>;
  const userMenu = Cookies.get("logged_in") ? loggedInUserMenu : guestMenu;

  return userMenu;
};
