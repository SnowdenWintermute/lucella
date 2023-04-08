/* eslint-disable consistent-return */
/* eslint-disable react/no-unescaped-entities */
import { Socket } from "socket.io-client";
import { useState } from "react";
import { Alert } from "../../../classes/Alert";
import { ERROR_MESSAGES, SocketEventsFromClient } from "../../../../../common";
import { AlertType } from "../../../enums";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setAlert } from "../../../redux/slices/alerts-slice";
import { BUTTON_NAMES } from "../../../consts/button-names";
import { LobbyMenu, setActiveMenu, setCurrentGameRoomLoading } from "../../../redux/slices/lobby-ui-slice";
import LobbyTopListItemWithButton from "./LobbyTopListItemWithButton";
import useNonAlertCollidingEscapePressExecutor from "../../../hooks/useNonAlertCollidingEscapePressExecutor";
import { APP_TEXT } from "../../../consts/app-text";

function GameSetupMenu({ socket }: { socket: Socket }) {
  const dispatch = useAppDispatch();
  const { currentGameRoomLoading } = useAppSelector((state) => state.lobbyUi);
  const [gameNameInput, setGameNameInput] = useState("");

  const makeGamePublic = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const gameNameToCreate = gameNameInput;
    // todo - run client side validation (reuse server function)
    if (!gameNameToCreate || !socket) return dispatch(setAlert(new Alert(ERROR_MESSAGES.LOBBY.GAME_NAME.NOT_ENTERED, AlertType.DANGER)));
    socket.emit(SocketEventsFromClient.HOSTS_NEW_GAME, gameNameToCreate);
    dispatch(setCurrentGameRoomLoading(true));
  };

  useNonAlertCollidingEscapePressExecutor(() => dispatch(setActiveMenu(LobbyMenu.MAIN)));

  return (
    <>
      <ul className="lobby-menus__top-buttons">
        <LobbyTopListItemWithButton title={BUTTON_NAMES.GAME_SETUP.CANCEL} onClick={() => dispatch(setActiveMenu(LobbyMenu.MAIN))} extraStyles="" />
      </ul>
      <section className="lobby-menu game-setup-menu">
        <div className="lobby-menu__left game-setup-menu__left">
          <form onSubmit={makeGamePublic} className="game-setup-menu__form">
            <h3 className="lobby-menu__header">{APP_TEXT.GAME_SETUP.TITLE}</h3>
            <label htmlFor="game-name-input" className="game-setup-menu__input-label">
              {APP_TEXT.GAME_SETUP.GAME_CREATION_INPUT_LABEL}
              <input
                id="game-name-input"
                className="input input--transparent"
                aria-label="Enter a game name"
                placeholder="Enter a game name"
                data-cy="game-name-input"
                value={gameNameInput}
                autoFocus
                onChange={(e) => {
                  setGameNameInput(e.target.value);
                }}
              />
            </label>
            <button type="submit" className="button button--accent game-setup-menu__button" disabled={!!currentGameRoomLoading}>
              {BUTTON_NAMES.GAME_SETUP.CREATE_GAME}
            </button>
          </form>
        </div>
        <div className="lobby-menu__right game-setup-menu__right">
          <h3 className="lobby-menu__header">Battle Room rules</h3>
          <ul>
            <li>Send your orbs to the opponent's endzone to score points</li>
            <li>Select and move orbs toward your mouse cursor with number keys 1 - 5</li>
            <li>Orbs that touch each other are sent back to their respective endzones</li>
            <li>Game speed increases with each point scored</li>
          </ul>
        </div>
      </section>
    </>
  );
}

export default GameSetupMenu;
