import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as SuccessIcon } from "../../../../../src/img/alertIcons/success.svg";
import PropTypes from "prop-types";
import * as gameUiActions from "../../../../store/actions/game-ui";
import * as alertActions from "../../../../store/actions/alert";

const PreGameRoom = ({ socket }) => {
  const dispatch = useDispatch();
  const preGameScreen = useSelector(
    (state) => state.gameUi.preGameScreen.isOpen
  );
  const [preGameRoomDisplayClass, setPreGameRoomDisplayClass] = useState(
    "height-0-hidden"
  );
  const [gameNameInput, setGameNameInput] = useState("");

  const currentGame = useSelector((state) => state.gameUi.currentGame);

  // element's own visibility/showclass
  useEffect(() => {
    if (preGameScreen) setPreGameRoomDisplayClass("");
    if (!preGameScreen) setPreGameRoomDisplayClass("height-0-hidden");
  }, [preGameScreen]);

  useEffect(() => {
    console.log("27");
    // console.log(playersReady);
  }, [currentGame]);

  // players in room and their ready status/ the countdown
  useEffect(() => {
    if (!socket) return;
    socket.on("currentGameRoomUpdate", (data) => {
      console.log(data);
      dispatch(gameUiActions.setCurrentGame(data));
    });
    socket.on("gameClosedByHost", () => {
      dispatch(gameUiActions.closePreGameScreen());
    });
    socket.on("updateOfCurrentRoomPlayerReadyStatus", (playersReady) => {
      if (!currentGame) return null;
      const updatedCurrentGame = currentGame;
      updatedCurrentGame.playersReady = playersReady;
      console.log(updatedCurrentGame);
      dispatch(gameUiActions.setCurrentGame(updatedCurrentGame));
      console.log("updated readys ");
      console.log(playersReady);
    });
    socket.on("currentGameStatusUpdate", (gameStatus) => {
      if (!currentGame) return;
      const updatedCurrentGame = currentGame;
      updatedCurrentGame.gameStatus = gameStatus;
      console.log(updatedCurrentGame);
      dispatch(gameUiActions.setCurrentGame(updatedCurrentGame));
    });
    socket.on("currentGameCountdownUpdate", (countdown) => {
      if (!currentGame) return;
      const updatedCurrentGame = currentGame;
      updatedCurrentGame.countdown = countdown;
      dispatch(gameUiActions.setCurrentGame(updatedCurrentGame));
    });
    return () => {
      socket.off("currentGameRoomUpdate");
      socket.off("gameClosedByHost");
      socket.off("updateOfCurrentRoomPlayerReadyStatus");
      socket.off("currentGameStatusUpdate");
      socket.off("currentGameCountdownUpdate");
    };
  }, [socket, dispatch, currentGame]);

  // 'make public' actually request to server to host a game
  const makeGamePublic = (e) => {
    e.preventDefault();
    const gameName = gameNameInput;
    if (gameName) {
      socket.emit("clientHostsNewGame", { gameName });
    } else {
      dispatch(alertActions.setAlert("Please enter a game name", "danger"));
    }
  };

  // ready up
  const onReadyClick = () => {
    console.log(currentGame);
    socket.emit("clientClicksReady", { gameName: currentGame.gameName });
  };

  const preGameRoomMenu = currentGame ? (
    <Fragment>
      <h3>Game: {currentGame.gameName}</h3>
      <div>Players:</div>
      <table className="pre-game-room-player-list">
        <tbody>
          <tr>
            <td>{currentGame.players.host.username}</td>
            <td>
              {currentGame.playersReady.host && (
                <SuccessIcon className="alert-icon"></SuccessIcon>
              )}
            </td>
          </tr>
          <tr>
            <td>
              {currentGame.players.challenger
                ? currentGame.players.challenger.username
                : "Awaiting challenger..."}
            </td>
            <td>
              {currentGame.playersReady.challenger && (
                <SuccessIcon className="alert-icon"></SuccessIcon>
              )}
            </td>
          </tr>
          <tr>
            <td>{currentGame.gameStatus}</td>
            <td>
              {currentGame.gameStatus === "countingDown" &&
                currentGame.countdown}
            </td>
          </tr>
        </tbody>
      </table>
      <button className="button button-primary" onClick={onReadyClick}>
        READY
      </button>
    </Fragment>
  ) : (
    <form
      onSubmit={(e) => {
        makeGamePublic(e);
      }}
    >
      <h3 className="mb-10">Host a friendly match:</h3>
      <input
        autoFocus={true}
        className={"text-input-transparent  mb-10"}
        placeholder={"Enter a game name"}
        value={gameNameInput}
        onChange={(e) => {
          setGameNameInput(e.target.value);
        }}
      />
      <button className="button button-primary">Make Public</button>
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

PreGameRoom.propTypes = {
  socket: PropTypes.object,
};

export default PreGameRoom;
