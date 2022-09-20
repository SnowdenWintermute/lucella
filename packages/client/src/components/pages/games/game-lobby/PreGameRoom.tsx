import React, { Fragment, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as SuccessIcon } from "../../../../img/alertIcons/success.svg";
import * as alertActions from "../../../../store/actions/alert";
import { Socket } from "socket.io-client";
import { RootState } from "../../../../store";
import { GameUIState } from "../../../../store/reducers/game-ui";
import { GameStatus } from "@lucella/common/battleRoomGame/enums";
import { AlertType } from "../../../../enums";

interface Props {
  socket: Socket;
}

const PreGameRoom = ({ socket }: Props) => {
  const dispatch = useDispatch();
  const gameUiState: GameUIState = useSelector((state: RootState) => state.gameUi);
  const preGameScreenIsOpen = gameUiState.preGameScreen.isOpen;
  const [preGameRoomDisplayClass, setPreGameRoomDisplayClass] = useState("height-0-hidden");
  const [gameNameInput, setGameNameInput] = useState("");
  const { gameStatus, playersReady, playersInGame, currentGameName, countdownNumber, isRanked, playerRole } =
    gameUiState;
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
    const gameName = gameNameInput;
    if (gameName && socket) {
      socket.emit("clientHostsNewGame", { gameName });
    } else {
      dispatch(alertActions.setAlert("Please enter a game name", AlertType.DANGER));
    }
  };

  const onReadyClick = () => {
    socket.emit("clientClicksReady", { gameName: currentGameName });
  };

  const preGameRoomMenu = currentGameName ? (
    <Fragment>
      <h3>
        {!isRanked &&
          (playerRole && playerRole === "host" ? "You are the host of " : "You are challinging the host of ")}
        game: {currentGameName}
      </h3>
      <div>Players:</div>
      <table className="pre-game-room-player-list">
        <tbody>
          <tr>
            <td>{playersInGame?.host.username}</td>
            <td>{playersReady.host && <SuccessIcon className="alert-icon"></SuccessIcon>}</td>
          </tr>
          <tr>
            <td>{playersInGame?.challenger ? playersInGame.challenger.username : "Awaiting challenger..."}</td>
            <td>{playersReady.challenger && <SuccessIcon className="alert-icon"></SuccessIcon>}</td>
          </tr>
          <tr>
            <td>{gameStatus}</td>
            <td>{gameStatus === GameStatus.COUNTING_DOWN && countdownNumber}</td>
          </tr>
        </tbody>
      </table>
      {!isRanked && (
        <button className="button button-standard-size button-primary" onClick={onReadyClick}>
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
