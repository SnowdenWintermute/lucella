/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable consistent-return */
/* eslint-disable react/no-unescaped-entities */
import { Socket } from "socket.io-client";
import { useState } from "react";
import { Alert } from "../../../classes/Alert";
import { CSEventsFromClient, ERROR_MESSAGES, SocketEventsFromClient } from "../../../../../common";
import { AlertType } from "../../../enums";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setAlert } from "../../../redux/slices/alerts-slice";
import { BUTTON_NAMES } from "../../../consts/button-names";
import { LobbyMenu, setActiveMenu, setGameRoomLoading } from "../../../redux/slices/lobby-ui-slice";
import LobbyTopListItemWithButton from "./LobbyTopListItemWithButton";
import useNonAlertCollidingEscapePressExecutor from "../../../hooks/useNonAlertCollidingEscapePressExecutor";
import { APP_TEXT } from "../../../consts/app-text";
import BattleRoomRules from "./BattleRoomRules";

function GameSetupMenu({ socket }: { socket: Socket }) {
  const dispatch = useAppDispatch();
  const { gameRoomLoading } = useAppSelector((state) => state.lobbyUi);
  const GAME_TYPES = {
    BATTLE_ROOM: "Battle Room",
    COMBAT_SIMULATOR: "Combat Simulator",
  };
  const [gameType, setGameType] = useState(GAME_TYPES.BATTLE_ROOM);
  const [gameNameInput, setGameNameInput] = useState("");

  const makeGamePublic = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const gameNameToCreate = gameNameInput;
    // todo - run client side validation (reuse server function)
    if (!gameNameToCreate || !socket) return dispatch(setAlert(new Alert(ERROR_MESSAGES.LOBBY.GAME_NAME.NOT_ENTERED, AlertType.DANGER)));
    if (gameType === GAME_TYPES.BATTLE_ROOM) socket.emit(SocketEventsFromClient.HOSTS_NEW_GAME, gameNameToCreate);
    else socket.emit(CSEventsFromClient.CREATES_NEW_COMBAT_SIM, gameNameToCreate);
    dispatch(setGameRoomLoading(true));
  };

  useNonAlertCollidingEscapePressExecutor(() => dispatch(setActiveMenu(LobbyMenu.MAIN)));

  const toggleGameType = () => {
    if (gameType === GAME_TYPES.BATTLE_ROOM) setGameType(GAME_TYPES.COMBAT_SIMULATOR);
    else setGameType(GAME_TYPES.BATTLE_ROOM);
  };

  return (
    <>
      <ul className="lobby-menus__top-buttons">
        <LobbyTopListItemWithButton title={BUTTON_NAMES.GAME_SETUP.CANCEL} onClick={() => dispatch(setActiveMenu(LobbyMenu.MAIN))} extraStyles="" />
        <LobbyTopListItemWithButton title="TOGGLE GAME TYPE" onClick={toggleGameType} extraStyles="" />
      </ul>
      <section className="lobby-menu game-setup-menu">
        <div className="lobby-menu__left game-setup-menu__left">
          <form onSubmit={makeGamePublic} className="game-setup-menu__form">
            <h3 className="lobby-menu__header">{gameType === GAME_TYPES.BATTLE_ROOM ? APP_TEXT.GAME_SETUP.TITLE : "Creating a Combat Simulator"}</h3>
            <label htmlFor="game-name-input" className="game-setup-menu__input-label">
              {APP_TEXT.GAME_SETUP.GAME_CREATION_INPUT_LABEL}
              <input
                id="game-name-input"
                className="input input--transparent game-setup-menu__game-name-input"
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
            <button type="submit" className="button button--accent game-setup-menu__button" disabled={!!gameRoomLoading}>
              {BUTTON_NAMES.GAME_SETUP.CREATE_GAME}
            </button>
          </form>
        </div>
        <div className="lobby-menu__right game-setup-menu__right">
          {gameType === GAME_TYPES.BATTLE_ROOM && <BattleRoomRules />}
          {gameType === GAME_TYPES.COMBAT_SIMULATOR && "There are no rules inside the simulator"}
        </div>
      </section>
    </>
  );
}

export default GameSetupMenu;
