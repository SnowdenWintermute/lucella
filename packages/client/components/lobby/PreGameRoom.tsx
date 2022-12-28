import { Socket } from "socket.io-client";
import React, { Fragment, useState, useEffect, useRef } from "react";
import SuccessIcon from "../../img/alertIcons/success.svg";
import { AlertType } from "../../enums";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Alert } from "../../classes/Alert";
import { setAlert } from "../../redux/slices/alerts-slice";
import { ErrorMessages, GameStatus, SocketEventsFromClient } from "../../../common";
import styles from "./game-lobby.module.scss";

interface Props {
  socket: Socket;
}

function PreGameRoom({ socket }: Props) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const preGameScreenIsOpen = lobbyUiState.preGameScreen.isOpen;
  const [preGameRoomDisplayClass, setPreGameRoomDisplayClass] = useState("height-0-hidden");
  const [gameNameInput, setGameNameInput] = useState("");
  const gameStatus = lobbyUiState.currentGameRoom && lobbyUiState.currentGameRoom.gameStatus;
  const playersReady = lobbyUiState.currentGameRoom && lobbyUiState.currentGameRoom.playersReady;
  const players = lobbyUiState.currentGameRoom && lobbyUiState.currentGameRoom.players;
  const isRanked = lobbyUiState.currentGameRoom && lobbyUiState.currentGameRoom.isRanked;
  const currentGameName = lobbyUiState.currentGameRoom && lobbyUiState.currentGameRoom.gameName;
  const countdown = lobbyUiState.currentGameRoom && lobbyUiState.currentGameRoom.countdown;

  const { playerRole } = lobbyUiState;
  const channelNameInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preGameScreenIsOpen) {
      setPreGameRoomDisplayClass("");
      if (!channelNameInput.current) return;
      channelNameInput.current.focus();
    }
    if (!preGameScreenIsOpen) setPreGameRoomDisplayClass("height-0-hidden");
  }, [preGameScreenIsOpen]);

  // 'make public' actually request to server to host a game (until now it is just the creation input window/box)
  const makeGamePublic = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const gameNameToCreate = gameNameInput;
    // todo - run validation reuse server function
    if (gameNameToCreate && socket) socket.emit(SocketEventsFromClient.HOSTS_NEW_GAME, gameNameToCreate);
    else dispatch(setAlert(new Alert(ErrorMessages.LOBBY.GAME_NAME.NOT_ENTERED, AlertType.DANGER)));
  };

  const handleReadyClick = () => {
    socket.emit(SocketEventsFromClient.CLICKS_READY);
  };

  const preGameRoomMenu = currentGameName ? (
    <>
      <h3>
        {!isRanked && (playerRole && playerRole === "host" ? "You are the host of " : "You are challinging the host of ")}
        game: {currentGameName}
      </h3>
      <div>Players:</div>
      <table role="table" aria-label="players in game" className="pre-game-room-player-list">
        <tbody>
          <tr>
            <td>{players?.host?.associatedUser.username}</td>
            <td aria-label="host status" className={styles["ready-icon-holder"]}>
              {playersReady?.host ? <SuccessIcon aria-label="ready" className={styles["ready-icon"]} /> : <span aria-label="not ready">...</span>}
            </td>
          </tr>
          <tr data-cy="challenger-info">
            <td>{players?.challenger ? players.challenger.associatedUser.username : "Awaiting challenger..."}</td>
            <td aria-label="challenger status" className={styles["ready-icon-holder"]}>
              {playersReady?.challenger ? <SuccessIcon aria-label="ready" className={styles["ready-icon"]} /> : <span aria-label="not ready">...</span>}
            </td>
          </tr>
          <tr>
            <td aria-label="game status">{gameStatus}</td>
            <td aria-label="game start countdown">{gameStatus === GameStatus.COUNTING_DOWN && countdown?.current}</td>
          </tr>
        </tbody>
      </table>
      {!isRanked && (
        <button type="button" className="button button-standard-size button-primary" onClick={handleReadyClick}>
          READY
        </button>
      )}
    </>
  ) : (
    <form
      onSubmit={(e) => {
        makeGamePublic(e);
      }}
    >
      <h3 className="mb-10">Host a friendly match:</h3>
      <input
        ref={channelNameInput}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        className="text-input-transparent  mb-10"
        aria-label="Enter a game name"
        placeholder="Enter a game name"
        data-cy="game-name-input"
        value={gameNameInput}
        onChange={(e) => {
          setGameNameInput(e.target.value);
        }}
      />
      <button type="submit" className="button button-standard-size button-primary">
        Make Public
      </button>
    </form>
  );

  return (
    <div className={`pre-game-room ${preGameRoomDisplayClass}`}>
      <div className="p-10">
        <div>{preGameRoomMenu}</div>
      </div>
    </div>
  );
}

export default PreGameRoom;
