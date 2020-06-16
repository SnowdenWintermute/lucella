import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ReactComponent as SuccessIcon } from "../../../../../src/img/alertIcons/success.svg";
import PropTypes from "prop-types";
import * as gameUiActions from "../../../../store/actions/game-ui";
import * as alertActions from "../../../../store/actions/alert";

const PreGameRoom = ({ socket }) => {
  const dispatch = useDispatch();
  const gameSetupScreenIsOpen = useSelector(
    (state) => state.gameUi.gameSetupScreen.isOpen
  );
  const [preGameRoomDisplayClass, setPreGameRoomDisplayClass] = useState(
    "height-0-hidden"
  );
  const [gameNameInput, setGameNameInput] = useState("");

  const currentGame = useSelector((state) => state.gameUi.currentGame);

  // element's own visibility/showclass
  useEffect(() => {
    if (gameSetupScreenIsOpen) setPreGameRoomDisplayClass("");
    if (!gameSetupScreenIsOpen) setPreGameRoomDisplayClass("height-0-hidden");
  }, [gameSetupScreenIsOpen]);

  // players in room and their ready status/ the countdown
  useEffect(() => {
    if (!socket) return;
    socket.on("currentGameRoomUpdate", (data) => {
      console.log(data);
      dispatch(gameUiActions.setCurrentGame(data));
    });
    return () => {
      socket.off("currentGameRoomUpdate");
      dispatch(gameUiActions.setCurrentGame(null));
    };
  }, [socket]);

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

  const preGameRoomMenu = currentGame ? (
    <Fragment>
      <h3>Game: {currentGame.gameName}</h3>
      <div>Players:</div>
      <table className="pre-game-room-player-list">
        <tbody>
          <tr>
            <td>{currentGame.players.host.username}</td>
            <td>
              <SuccessIcon className="alert-icon"></SuccessIcon>
            </td>
          </tr>
          <tr>
            <td>
              {currentGame.players.challenger
                ? currentGame.players.challenger
                : "Awaiting challenger..."}
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <button className="button button-primary">READY</button>
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
