/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-curly-brace-presence */
import React, { useState } from "react";
import { Socket } from "socket.io-client";
import Link from "next/link";
import MainMenuButtons from "./MainMenuButtons";
import Logo from "../../../img/logo.svg";
import { useGetMeQuery } from "../../../redux/api-slices/users-api-slice";
import { useGetLadderEntryQuery } from "../../../redux/api-slices/ladder-api-slice";
import LoadingSpinner from "../../common-components/LoadingSpinner";
import { ERROR_MESSAGES } from "../../../../../common";

function WelcomeDropdown() {
  const { data: user, isLoading: userIsLoading } = useGetMeQuery(null);
  const {
    isLoading: userScorecardIsLoading,
    isFetching: userScorecardIsFetching,
    data: userScorecardData,
    error: userScorecardError,
    refetch: userScorecardRefetch,
  } = useGetLadderEntryQuery(user?.name || "", { refetchOnMountOrArgChange: true });
  const [viewingPatchNotes, setViewingPatchNotes] = useState(false);

  let mainMenuLeftContent = <LoadingSpinner />;

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
  else if (!viewingPatchNotes && user)
    mainMenuLeftContent = (
      <div className="logged-in-user-display">
        <h4>Logged in as {user.name}</h4>
        {userScorecardData && (
          <ul className="logged-in-user-display__scorecard">
            <div className="logged-in-user-display__scorecard-row">
              <li>Rank: {userScorecardData.ladderEntry.rank}</li>
              <li>Elo: {userScorecardData.ladderEntry.elo}</li>
            </div>
            <div className="logged-in-user-display__scorecard-row">
              <li>Wins: {userScorecardData.ladderEntry.wins}</li>
              <li>Losses: {userScorecardData.ladderEntry.losses}</li>
            </div>
          </ul>
        )}

        {userScorecardError &&
          "data" in userScorecardError &&
          userScorecardError.data instanceof Array &&
          userScorecardError.data[0].message === ERROR_MESSAGES.LADDER.USER_NOT_FOUND && (
            <p>
              Welcome to Battle School. Once you have participated in ranked play in the Battle Room your stats will be shown here. Good luck and do your best!
            </p>
          )}
        {userScorecardError &&
          "data" in userScorecardError &&
          userScorecardError.data instanceof Array &&
          userScorecardError.data[0].message !== ERROR_MESSAGES.LADDER.USER_NOT_FOUND && <p>{userScorecardError.data[0].message}</p>}
        {userScorecardError && !("data" in userScorecardError) && <p>Failed to fetch Battle Room scorecard</p>}
      </div>
    );
  else if (viewingPatchNotes)
    mainMenuLeftContent = (
      <div className="patch-notes">
        <div>
          <h4>Version History</h4>
        </div>
        <span className="patch-notes__version-name">alpha 0.3.0</span>
        <ul>
          <li>
            Players can now issue waypoint commands to their orbs by holding <span className="patch-notes__keyboard-key-name">{"[Spacebar]"}</span> when
            assigning orb destinations
          </li>
          <li>Orb destinations and waypoint paths are now displayed for a player's own orbs</li>
        </ul>
        <span className="patch-notes__version-name">alpha 0.2.0</span>
        <ul>
          <li>Major overhaul of frontend styles</li>
          {/* eslint-disable-next-line react/jsx-curly-brace-presence */}
          <li>{'New themes, "VT320" and "HTML", currently accessible by clicking the website logo in the navbar'}</li>
          <li>Optimized modals and context menus</li>
          <li>Added support for screenreaders</li>
          <li>Fixed tab indexing of UI elements for better keyboard navigation</li>
          <li>Added loading spinners and indicators for several menus</li>
          <li>Changed to a new logo</li>
          <li>Updated the Battle Room colors to match the website themes (VT320 and default themes only)</li>
          <li>Added ability to close lobby menus with the Escape key</li>
          <li>Links can now be posted in chat</li>
        </ul>
        <button type="button" className="button" onClick={() => setViewingPatchNotes(false)}>
          Close
        </button>
      </div>
    );

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
