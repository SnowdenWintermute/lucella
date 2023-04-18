import React, { useState } from "react";
import { Socket } from "socket.io-client";
import Link from "next/link";
import MainMenuButtons from "./MainMenuButtons";
import Logo from "../../../../img/logo.svg";
import { useGetMeQuery } from "../../../../redux/api-slices/users-api-slice";
import LoadingSpinner from "../../../common-components/LoadingSpinner";
import LoggedInUserDisplay from "./LoggedInUserDisplay";
import PatchNotes from "./PatchNotes";
import { useAppSelector } from "../../../../redux/hooks";

function WelcomeDropdown() {
  const uiState = useAppSelector((state) => state.UI);
  const { data: user, isLoading: userIsLoading } = useGetMeQuery(null);
  const [viewingPatchNotes, setViewingPatchNotes] = useState(false);

  let mainMenuLeftContent = <div />;

  // if (userIsLoading && !uiState.showContextMenu) mainMenuLeftContent = <LoadingSpinner />;
  if (userIsLoading) mainMenuLeftContent = <LoadingSpinner />;
  else if (!viewingPatchNotes && !user)
    mainMenuLeftContent = (
      <>
        <p>Welcome to Battle School, a space station orbiting Earth at the 5th Lagrange Point.</p>
        <p>Create an account to have your name listed on the ladder, or play a casual game to learn the rules before entering the competition.</p>
        <div className="welcome-menu__links">
          <Link href="/login" className={`button ${"welcome-menu__link"}`}>
            Login
          </Link>
          <Link href="/register" className="button button--accent welcome-menu__link">
            Create Account
          </Link>
        </div>
      </>
    );
  else if (!viewingPatchNotes && user) mainMenuLeftContent = <LoggedInUserDisplay user={user} />;
  else if (viewingPatchNotes) mainMenuLeftContent = <PatchNotes setViewingPatchNotes={setViewingPatchNotes} />;

  return (
    <section className="lobby-menu welcome-menu">
      <div className="lobby-menu__left welcome-menu__left">{mainMenuLeftContent}</div>
      <div className="lobby-menu__right welcome-menu__right">
        <Logo className="welcome-menu__logo" />
        <button type="button" className="welcome-menu__version" onClick={() => setViewingPatchNotes(!viewingPatchNotes)}>
          alpha 0.3.0
        </button>
      </div>
    </section>
  );
}

function MainMenu({ socket }: { socket: Socket }) {
  return (
    <>
      <ul className="lobby-menus__top-buttons">
        <MainMenuButtons socket={socket} />
      </ul>
      <WelcomeDropdown />
    </>
  );
}

export default MainMenu;
