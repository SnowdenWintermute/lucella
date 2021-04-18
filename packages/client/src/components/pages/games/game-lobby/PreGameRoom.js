import React, { Fragment, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as SuccessIcon } from "../../../../img/alertIcons/success.svg";
import PropTypes from "prop-types";
import * as alertActions from "../../../../store/actions/alert";

const PreGameRoom = ({ socket }) => {
  const dispatch = useDispatch();
  const preGameScreen = useSelector(
    (state) => state.gameUi.preGameScreen.isOpen,
  );
  const [preGameRoomDisplayClass, setPreGameRoomDisplayClass] = useState(
    "height-0-hidden",
  );
  const [gameNameInput, setGameNameInput] = useState("");
  const gameStatus = useSelector((state) => state.gameUi.gameStatus);
  const playersReady = useSelector((state) => state.gameUi.playersReady);
  const playersInGame = useSelector((state) => state.gameUi.playersInGame);
  const currentGameName = useSelector((state) => state.gameUi.currentGameName);
  const countdownNumber = useSelector((state) => state.gameUi.countdownNumber);
  const isRanked = useSelector((state) => state.gameUi.isRanked);
  const playerRole = useSelector(
    (state) => state.gameUi.playerRole,
  );

  const channelNameInput = useRef();

  // element's own visibility/showclass
  useEffect(() => {
    if (preGameScreen) {
      setPreGameRoomDisplayClass("");
      if (!channelNameInput.current) return;
      channelNameInput.current.focus();
    }
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
    socket.emit("clientClicksReady", { gameName: currentGameName });
  };

  const preGameRoomMenu = currentGameName ? (
    <Fragment>
      <h3>
        {!isRanked &&
          (playerRole && playerRole === "host"
            ? "You are the host of "
            : "You are challinging the host of ")}
        game: {currentGameName}
      </h3>
      <div>Players:</div>
      <table className="pre-game-room-player-list">
        <tbody>
          <tr>
            <td>{playersInGame.host.username}</td>
            <td>
              {playersReady.host && (
                <SuccessIcon className="alert-icon"></SuccessIcon>
              )}
            </td>
          </tr>
          <tr>
            <td>
              {playersInGame.challenger
                ? playersInGame.challenger.username
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
            <td>{gameStatus === "countingDown" && countdownNumber}</td>
          </tr>
        </tbody>
      </table>
      {!isRanked && (
        <button
          className="button button-standard-size button-primary"
          onClick={onReadyClick}
        >
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
      <button className="button button-standard-size button-primary">
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
};

PreGameRoom.propTypes = {
  socket: PropTypes.object,
};

export default PreGameRoom;
