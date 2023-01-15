import Link from "next/link";
import { useState, useEffect } from "react";
import { useLogoutUserMutation } from "../../../redux/api-slices/auth-api-slice";
import { useGetMeQuery } from "../../../redux/api-slices/users-api-slice";

export function UserMenu() {
  const [showUserDropdown, toggleUserDropdown] = useState(false);
  const [logoutUser, { isUninitialized: logoutIsUninitialized }] = useLogoutUserMutation();
  const { data: user, isLoading, isFetching, isError } = useGetMeQuery(null, { refetchOnMountOrArgChange: true });

  const MENU = {
    LOADING: "LOADING",
    USER: "USER",
    LOGIN: "LOGIN",
  };

  const [menuToShow, setMenuToShow] = useState(MENU.LOADING);

  // show/hide menu
  useEffect(() => {
    const clearUserDropdown = (e: MouseEvent) => {
      const node = e.target as HTMLElement;
      if (node.getAttribute("data-name") !== "profile-icon") toggleUserDropdown(false);
    };
    window.addEventListener("click", clearUserDropdown);
    return () => window.removeEventListener("click", clearUserDropdown);
  }, [showUserDropdown]);

  const handleLogout = async () => {
    await logoutUser();
  };

  const menuLoading = <span>...</span>;

  const loggedInUserMenu = (
    <>
      <button
        type="button"
        className="user-icon-circle"
        data-name="profile-icon"
        data-cy="profile-icon"
        onClick={(e) => {
          toggleUserDropdown(!showUserDropdown);
        }}
      >
        <div className="user-icon-letter" data-name="profile-icon">
          {user?.name && user.name.slice(0, 1)}
        </div>
      </button>
      {showUserDropdown && (
        <ul className="user-menu">
          <Link href="/settings" className="user-menu-item">
            {/* <SettingsIcon className="menu-icon-svg" height="100" width="100" color="red" stroke="red" fill="red" /> */}
            Settings
          </Link>
          <Link href="/login" onClick={handleLogout} className="user-menu-item">
            {/* <Image alt="logout icon" src={logoutIcon} /> */}
            Logout
          </Link>
        </ul>
      )}
    </>
  );

  const guestMenu = (
    <Link href="/login" className="button button-standard-size button-basic">
      LOGIN
    </Link>
  );

  useEffect(() => {
    // console.log("user: ", user, "isLoading: ", isLoading, "isError: ", isError, "logoutIsUninitialized: ", logoutIsUninitialized, "isFetching: ", isFetching);
    if (user) setMenuToShow(MENU.USER);
    else if (isFetching && isLoading && logoutIsUninitialized && !isError) setMenuToShow(MENU.LOADING);
    else setMenuToShow(MENU.LOGIN);
  }, [user, isLoading, isError, logoutIsUninitialized]);

  if (menuToShow === MENU.LOADING) return menuLoading;
  if (menuToShow === MENU.USER) return loggedInUserMenu;
  return guestMenu;
}
