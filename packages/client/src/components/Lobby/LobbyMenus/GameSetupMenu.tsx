/* eslint-disable react/no-unescaped-entities */
import { Socket } from "socket.io-client";
import { useState } from "react";
import { Alert } from "../../../classes/Alert";
import { ErrorMessages, SocketEventsFromClient } from "../../../../../common";
import { AlertType } from "../../../enums";
import { useAppDispatch } from "../../../redux/hooks";
import { setAlert } from "../../../redux/slices/alerts-slice";
import { BUTTON_NAMES } from "../../../consts/button-names";
import lobbyMenusStyles from "./lobby-menus.module.scss";
import { LobbyMenu, setActiveMenu } from "../../../redux/slices/lobby-ui-slice";
import styles from "./game-setup-menu.module.scss";
import LobbyTopListItemWithButton from "./LobbyTopListItemWithButton";

function GameSetupMenu({ socket }: { socket: Socket }) {
  const dispatch = useAppDispatch();
  const [gameNameInput, setGameNameInput] = useState("");

  const makeGamePublic = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const gameNameToCreate = gameNameInput;
    // todo - run client side validation (reuse server function)
    if (gameNameToCreate && socket) socket.emit(SocketEventsFromClient.HOSTS_NEW_GAME, gameNameToCreate);
    else dispatch(setAlert(new Alert(ErrorMessages.LOBBY.GAME_NAME.NOT_ENTERED, AlertType.DANGER)));
  };

  return (
    <>
      <ul className={lobbyMenusStyles["lobby-menus__top-buttons"]}>
        <LobbyTopListItemWithButton title="Cancel" onClick={() => dispatch(setActiveMenu(LobbyMenu.MAIN))} extraStyles="" />
      </ul>
      <section className={`${lobbyMenusStyles["lobby-menu"]} ${styles["game-setup-menu"]}`}>
        <div className={`${lobbyMenusStyles["lobby-menu__left"]} ${styles["game-setup-menu__left"]}`}>
          <form onSubmit={makeGamePublic} className={styles["game-setup-menu__form"]}>
            <h3 className={lobbyMenusStyles["lobby-menu__header"]}>Creating an unranked game</h3>
            <label htmlFor="game-name-input" className={styles["game-setup-menu__input-label"]}>
              Game name:
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
            <button type="submit" className={`button button--accent ${styles["game-setup-menu__button"]}`}>
              {BUTTON_NAMES.GAME_ROOM.CREATE_GAME}
            </button>
          </form>
        </div>
        <div className={`${lobbyMenusStyles["lobby-menu__right"]} ${styles["game-setup-menu__right"]}`}>
          <h3 className={lobbyMenusStyles["lobby-menu__header"]}>Battle Room rules</h3>
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
