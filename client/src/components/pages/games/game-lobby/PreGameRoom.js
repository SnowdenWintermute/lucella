import React, { Fragment, useState, useEffect } from "react";
import { ReactComponent as SuccessIcon } from "../../../../../src/img/alertIcons/success.svg";
import PropTypes from "prop-types";

const PreGameRoom = ({ preGameRoomDisplayClass, hostNewGame, socket }) => {
  const [gameNameInput, setGameNameInput] = useState("");
  const [currentGameRoom, setCurrentGameRoom] = useState(null);

  const makeGamePublic = e => {
    e.preventDefault();
    hostNewGame({ gameName: gameNameInput });
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("currentGameRoomUpdate", data => {
      console.log(data);
      setCurrentGameRoom(data);
    });
    return () => {
      socket.off("currentGameRoomUpdate");
      setCurrentGameRoom(null);
    };
  }, [socket]);

  const preGameRoomMenu = currentGameRoom ? (
    <Fragment>
      <h3>Game: {currentGameRoom.gameName}</h3>
      <div>Players:</div>
      <table className="pre-game-room-player-list">
        <tbody>
          <tr>
            <td>{currentGameRoom.players.host.username}</td>
            <td>
              <SuccessIcon className="alert-icon"></SuccessIcon>
            </td>
          </tr>
          <tr>
            <td>
              {currentGameRoom.players.challenger
                ? currentGameRoom.players.challenger
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
      onSubmit={e => {
        makeGamePublic(e);
      }}
    >
      <h3 className="mb-10">Host a friendly match:</h3>
      <input
        className={"text-input-transparent  mb-10"}
        placeholder={"Enter a game name"}
        value={gameNameInput}
        onChange={e => {
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

PreGameRoom.propTypes = {};

export default PreGameRoom;
