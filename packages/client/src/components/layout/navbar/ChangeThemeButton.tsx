import React from "react";
import UIIcon from "../../../img/menu-icons/ui-icon.svg";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setTheme, Theme } from "../../../redux/slices/ui-slice";

function ChangeThemeButton() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.UI.theme);

  function handleChangeThemeClick() {
    if (currentTheme === Theme.DEFAULT) dispatch(setTheme(Theme.VT320));
    else dispatch(setTheme(Theme.DEFAULT));
  }

  return (
    <button type="button" className="change-theme-button" onClick={handleChangeThemeClick}>
      <UIIcon className="change-theme-button__bottom-icon" />
      <UIIcon className="change-theme-button__top-icon" />
    </button>
  );
}

export default ChangeThemeButton;
