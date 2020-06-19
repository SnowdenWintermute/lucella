import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as SuccessIcon } from "../../../../../src/img/alertIcons/success.svg";
import PropTypes from "prop-types";
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
  const gameStatus = useSelector((state) => state.gameUi.gameStatus);
  const playersReady = useSelector((state) => state.gameUi.playersReady);

  // element's own visibility/showclass
  useEffect(() => {
    if (preGameScreen) setPreGameRoomDisplayClass("");
    if (!preGameScreen) setPreGameRoomDisplayClass("height-0-hidden");
  }, [preGameScreen]);

  // 'make public' actually request to server to host a game
  const makeGamePublic = (e) => {
    e.preventDefault();
    const gameName = gameNameInput;
    if (gameName && socket) {
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
              {playersReady.host && (
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
              {playersReady.challenger && (
                <SuccessIcon className="alert-icon"></SuccessIcon>
              )}
            </td>
          </tr>
          <tr>
            <td>{gameStatus}</td>
            <td>{gameStatus === "countingDown" && currentGame.countdown}</td>
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
