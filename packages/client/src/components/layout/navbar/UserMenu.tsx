import Link from "next/link";
import { useState, useEffect } from "react";
import { useLogoutUserMutation } from "../../../redux/api-slices/auth-api-slice";
import { useGetMeQuery } from "../../../redux/api-slices/users-api-slice";

export function UserMenu() {
  const [showUserDropdown, toggleUserDropdown] = useState(false);
  const [logoutUser, { isUninitialized: logoutIsUninitialized }] = useLogoutUserMutation();
  const { data: user, isLoading, isFetching, isError } = useGetMeQuery(null, { refetchOnMountOrArgChange: true });
  const MENU = { LOADING: "LOADING", USER: "USER", LOGIN: "LOGIN" };
  const [menuToShow, setMenuToShow] = useState(MENU.LOADING);

  useEffect(() => {
    const clearUserDropdown = (e: MouseEvent) => {
      const node = e.target as HTMLElement;
      if (node.id !== "user-menu-button") toggleUserDropdown(false);
    };
    window.addEventListener("click", clearUserDropdown);
    return () => window.removeEventListener("click", clearUserDropdown);
  }, [showUserDropdown]);

  const handleLogout = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (user) setMenuToShow(MENU.USER);
    else if (isFetching && isLoading && logoutIsUninitialized && !isError) setMenuToShow(MENU.LOADING);
    else setMenuToShow(MENU.LOGIN);
  }, [user, isLoading, isError, logoutIsUninitialized]);

  const menuLoading = <span>...</span>;

  const loggedInUserMenu = (
    <div className="user-menu">
      <button
        id="user-menu-button"
        type="button"
        className="user-menu__button"
        aria-controls="user-menu-items"
        aria-expanded={showUserDropdown}
        data-cy="user-menu-button"
        onClick={(e) => {
          toggleUserDropdown(!showUserDropdown);
        }}
      >
        <span className="screenreader-only">User Menu</span>
        {user?.name && user.name.slice(0, 1).toUpperCase()}
      </button>

      {showUserDropdown && (
        <ul id="user-menu-items" className="user-menu__items">
          <Link href="/settings" className="user-menu__menu-item">
            Settings
          </Link>
          <Link href="/login" className="user-menu__menu-item" onClick={handleLogout}>
            Logout
          </Link>
        </ul>
      )}
    </div>
  );

  const guestMenu = (
    <Link href="/login" className="button">
      LOGIN
    </Link>
  );

  if (menuToShow === MENU.LOADING) return menuLoading;
  if (menuToShow === MENU.USER) return loggedInUserMenu;
  return guestMenu;
}
