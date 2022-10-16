import Cookies from "js-cookie";
import Link from "next/link";
import { useState, useEffect, Fragment } from "react";
import logoutIcon from "../../../img/menuIcons/logout.png";
import SettingsIcon from "../../../img/menuIcons/settings.svg";
import { useAppDispatch } from "../../../redux";
import { useLoginUserMutation, useLogoutUserMutation } from "../../../redux/api-slices/auth-api-slice";
import { userApi } from "../../../redux/api-slices/user-api-slice";

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const [showUserDropdown, toggleUserDropdown] = useState(false);
  const [logoutUser] = useLogoutUserMutation();
  const [loginUser, { reset: resetLoginMutationCache }] = useLoginUserMutation();
  const { isLoading: userIsLoading, isFetching: userIsFetching } = userApi.endpoints.getMe.useQuery(null, {
    skip: false,
    refetchOnMountOrArgChange: true,
  });
  const user = userApi.endpoints.getMe.useQueryState(null, { selectFromResult: ({ data }) => data! });

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
    Cookies.remove("logged_in");
    // await resetLoginMutationCache();
    logoutUser();
    dispatch(userApi.util.resetApiState());
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

  if (userIsLoading || userIsFetching) return <p>...</p>;
  const userMenu = Cookies.get("logged_in") ? loggedInUserMenu : guestMenu;

  return userMenu;
};
