import Link from "next/link";
import { useState, useEffect } from "react";
import { APP_TEXT } from "../../../consts/app-text";
import { ARIA_LABELS } from "../../../consts/aria-labels";
import { useLogoutUserMutation } from "../../../redux/api-slices/auth-api-slice";
import { useGetMeQuery } from "../../../redux/api-slices/users-api-slice";
import { useAppSelector } from "../../../redux/hooks";

export function UserMenu() {
  const uiState = useAppSelector((state) => state.UI);
  const [showUserDropdown, toggleUserDropdown] = useState(false);
  const [logoutUser, { isUninitialized: logoutIsUninitialized }] = useLogoutUserMutation();
  const { data: user, isLoading, isFetching, isError } = useGetMeQuery(null);
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

  const menuLoading = (
    <div className="user-menu">
      <div className="user-menu__button user-menu__button--loading" />
    </div>
  );

  const loggedInUserMenu = (
    <div className="user-menu">
      <button
        id="user-menu-button"
        type="button"
        className="user-menu__button"
        aria-controls="user-menu-items"
        aria-expanded={showUserDropdown}
        aria-label={ARIA_LABELS.USER_MENU.OPEN}
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
            {APP_TEXT.USER_MENU.ITEMS.SETTINGS}
          </Link>
          <Link href="/login" className="user-menu__menu-item" onClick={handleLogout}>
            {APP_TEXT.USER_MENU.ITEMS.LOGOUT}
          </Link>
        </ul>
      )}
    </div>
  );

  const guestMenu = (
    <Link href="/login" className="button">
      {APP_TEXT.USER_MENU.LOGIN}
    </Link>
  );

  if (menuToShow === MENU.LOADING) return menuLoading;
  if (menuToShow === MENU.USER) return loggedInUserMenu;
  return guestMenu;
}
