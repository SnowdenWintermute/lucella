import React, { Fragment, useState } from "react";
import { ReactComponent as SuccessIcon } from "../../../../../src/img/alertIcons/success.svg";
import PropTypes from "prop-types";

const PreGameRoom = ({
  preGameRoomDisplayClass,
  hostNewGame,
  gameMadePublic
}) => {
  const [gameNameInput, setGameNameInput] = useState("");

  const onMakePublicClick = () => {
    hostNewGame();
  };

  const preGameRoomMenu = gameMadePublic ? (
    <Fragment>
      <div>{gameNameInput}</div>
      <div>Players:</div>
      <table className="pre-game-room-player-list">
        <tbody>
          <tr>
            <td>Snowden</td>
            <td>
              <SuccessIcon className="alert-icon"></SuccessIcon>
            </td>
          </tr>
          <tr>
            <td>Awaiting opponent...</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <button className="button button-primary">READY</button>
    </Fragment>
  ) : (
    <Fragment>
      <input
        className={"text-input-transparent  mb-10"}
        placeholder={"Enter a game name"}
        value={gameNameInput}
        onChange={e => {
          setGameNameInput(e.target.value);
        }}
      />
      <button
        className="button button-primary"
        onClick={() => onMakePublicClick()}
      >
        Make Public
      </button>
    </Fragment>
  );

  return (
    <div className={`pre-game-room ${preGameRoomDisplayClass}`}>
      <div className="p-10">
        <div>
          <h3 className="mb-10">Hosting a friendly match:</h3>
          {preGameRoomMenu}
        </div>
      </div>
    </div>
  );
};

PreGameRoom.propTypes = {};

export default PreGameRoom;
