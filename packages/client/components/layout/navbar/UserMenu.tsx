import Link from "next/link";
import { useState, useEffect, Fragment } from "react";
import logoutIcon from "../../../img/menuIcons/logout.png";
import SettingsIcon from "../../../img/menuIcons/settings.svg";
import { useLogoutUserMutation } from "../../../redux/api-slices/auth-api-slice";
import { usersApi } from "../../../redux/api-slices/users-api-slice";

export function UserMenu() {
  const [showUserDropdown, toggleUserDropdown] = useState(false);
  const [logoutUser] = useLogoutUserMutation();
  const { data: user, isLoading } = usersApi.endpoints.getMe.useQuery(null, { refetchOnMountOrArgChange: true });

  // show/hide menu
  useEffect(() => {
    const clearUserDropdown = (e: MouseEvent) => {
      const node = e.target as HTMLElement;
      if (node.getAttribute("data-name") !== "profile-icon") toggleUserDropdown(false);
    };
    window.addEventListener("click", (e) => clearUserDropdown(e));
    return () => window.removeEventListener("click", clearUserDropdown);
  }, [showUserDropdown]);

  const handleLogout = async () => {
    logoutUser();
  };

  useEffect(() => {}, [user]);

  const loggedInUserMenu = (
    <>
      <button
        type="button"
        className="user-icon-circle"
        data-name="profile-icon"
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
          <Link href="/login" onClick={(e) => handleLogout()} className="user-menu-item">
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

  // if (userIsLoading || userIsFetching) return <p>...</p>;
  // eslint-disable-next-line no-nested-ternary
  return isLoading ? <span>...</span> : user ? loggedInUserMenu : guestMenu;
}
