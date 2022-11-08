import React, { Fragment, useState, useEffect, useRef } from "react";
import SuccessIcon from "../../img/alertIcons/success.svg";
import { Socket } from "socket.io-client";
import { AlertType } from "../../enums";
import { useAppDispatch, useAppSelector } from "../../redux";
import { Alert } from "../../classes/Alert";
import { setAlert } from "../../redux/slices/alerts-slice";
import { GameStatus, SocketEventsFromClient } from "../../../common";
import styles from "./game-lobby.module.scss";

interface Props {
  socket: Socket;
}

const PreGameRoom = ({ socket }: Props) => {
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

  // 'make public' actually request to server to host a game
  const makeGamePublic = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const gameNameToCreate = gameNameInput;
    if (gameNameToCreate && socket) socket.emit(SocketEventsFromClient.HOSTS_NEW_GAME, gameNameToCreate);
    else dispatch(setAlert(new Alert("Please enter a game name", AlertType.DANGER)));
  };

  const handleReadyClick = () => {
    socket.emit(SocketEventsFromClient.CLICKS_READY, currentGameName);
  };

  const preGameRoomMenu = currentGameName ? (
    <Fragment>
      <h3>
        {!isRanked && (playerRole && playerRole === "host" ? "You are the host of " : "You are challinging the host of ")}
        game: {currentGameName}
      </h3>
      <div>Players:</div>
      <table className="pre-game-room-player-list">
        <tbody>
          <tr>
            <td>{players?.host?.associatedUser.username}</td>
            <td className={styles["ready-icon-holder"]}>{playersReady?.host && <SuccessIcon className={styles["ready-icon"]}></SuccessIcon>}</td>
          </tr>
          <tr>
            <td>{players?.challenger ? players.challenger.associatedUser.username : "Awaiting challenger..."}</td>
            <td className={styles["ready-icon-holder"]}>{playersReady?.challenger && <SuccessIcon className={styles["ready-icon"]}></SuccessIcon>}</td>
          </tr>
          <tr>
            <td>{gameStatus}</td>
            <td>{gameStatus === GameStatus.COUNTING_DOWN && countdown?.current}</td>
          </tr>
        </tbody>
      </table>
      {!isRanked && (
        <button className="button button-standard-size button-primary" onClick={handleReadyClick}>
          READY
        </button>
      )}
    </Fragment>
  ) : (
    <form
      onSubmit={(e) => {
        makeGamePublic(e);
      }}
    >
      <h3 className="mb-10">Host a friendly match:</h3>
      <input
        ref={channelNameInput}
        autoFocus={true}
        className={"text-input-transparent  mb-10"}
        placeholder={"Enter a game name"}
        value={gameNameInput}
        onChange={(e) => {
          setGameNameInput(e.target.value);
        }}
      />
      <button className="button button-standard-size button-primary">Make Public</button>
    </form>
  );

  return (
    <div className={`pre-game-room ${preGameRoomDisplayClass}`}>
      <div className="p-10">
        <div>{preGameRoomMenu}</div>
      </div>
    </div>
  );
};

export default PreGameRoom;
