import Link from "next/link";
import { useState, useEffect, Fragment } from "react";
import logoutIcon from "../../../img/menuIcons/logout.png";
import SettingsIcon from "../../../img/menuIcons/settings.svg";
import { useAppDispatch } from "../../../redux";
import { authApi, useLogoutUserMutation } from "../../../redux/api-slices/auth-api-slice";

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const [showUserDropdown, toggleUserDropdown] = useState(false);
  const [logoutUser] = useLogoutUserMutation();
  const {
    data: userState,
    isLoading: userQueryIsLoading,
    isSuccess: userQueryIsSuccess,
    isFetching: userQueryIsFetching,
  } = authApi.endpoints.getMe.useQuery(null, { refetchOnMountOrArgChange: true });
  const user = authApi.endpoints.getMe.useQueryState(null, { selectFromResult: ({ data }) => data! });

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
          {user?.name && user.name.slice(0, 1)}
        </div>
      </div>
      {showUserDropdown && (
        <ul className="user-menu">
          <Link href="/settings">
            <a className="user-menu-item">
              {/* <SettingsIcon className="menu-icon-svg" height="100" width="100" color="red" stroke="red" fill="red" /> */}
              Settings
            </a>
          </Link>
          <Link href="/login">
            <a className="user-menu-item" onClick={(e) => handleLogout()}>
              {/* <Image alt="logout icon" src={logoutIcon} /> */}
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

  // if (userIsLoading || userIsFetching) return <p>...</p>;
  const userMenu = user ? loggedInUserMenu : guestMenu;

  return userMenu;
};
