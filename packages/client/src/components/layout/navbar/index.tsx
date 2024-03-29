import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { UserMenu } from "./UserMenu";
import Logo from "../../../img/logo.svg";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setTheme, Theme } from "../../../redux/slices/ui-slice";
import { APP_TEXT } from "../../../consts/app-text";
import { FrontendRoutes } from "../../../../../common";

function NavigationLink({ title, href }: { title: string; href: string }) {
  const router = useRouter();
  return (
    <Link href={href} className={`main-navigation__page-link ${router.pathname === href && "main-navigation__page-link--active"}`}>
      <span>{title}</span>
    </Link>
  );
}

export default function Navbar() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.UI.theme);

  function handleChangeThemeClick() {
    if (currentTheme === Theme.DEFAULT) dispatch(setTheme(Theme.VT320));
    else if (currentTheme === Theme.VT320) dispatch(setTheme(Theme.HTML));
    else if (currentTheme === Theme.HTML) dispatch(setTheme(Theme.VIRGINIA_BLUEBELL));
    else dispatch(setTheme(Theme.DEFAULT));
  }
  return (
    <nav className="main-navigation">
      <div className="main-navigation__left-side">
        <button type="button" onClick={handleChangeThemeClick} className="main-navigation__site-logo-button">
          <Logo className="main-navigation__site-logo" />
        </button>
        <div>
          <Link href="/" className="main-navigation__logo-text">
            Battle School
          </Link>
          <NavigationLink title={APP_TEXT.NAV.GAME} href={FrontendRoutes.BATTLE_ROOM} />
          <NavigationLink title={APP_TEXT.NAV.LADDER} href={FrontendRoutes.LADDER} />
        </div>
      </div>
      <UserMenu />
    </nav>
  );
}
