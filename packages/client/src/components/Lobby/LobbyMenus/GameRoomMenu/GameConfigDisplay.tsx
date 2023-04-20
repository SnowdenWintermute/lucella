import { Socket } from "socket.io-client";
import React, { useRef } from "react";
import ArrowShape from "../../../../img/menu-icons/arrow-button-icon.svg";
import SelectDropdown from "../../../common-components/SelectDropdown";
import { useAppSelector } from "../../../../redux/hooks";
import { SocketEventsFromClient } from "../../../../../../common";
import useElementIsOverflowing from "../../../../hooks/useElementIsOverflowing";
import useScrollbarSize from "../../../../hooks/useScrollbarSize";

function GameConfigSelect({ title, children }: { title: string; children: JSX.Element | JSX.Element[] }) {
  return (
    <div className="game-config-display__option">
      <div className="game-config-display__option-title">{title}</div>
      {children}
    </div>
  );
}

function GameConfigDisplay({ socket, setParentDisplay, isHost }: { socket: Socket; setParentDisplay: (value: boolean) => void; isHost: boolean }) {
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const gameConfigDisplayRef = useRef<HTMLDivElement>(null);
  const isOverflowing = useElementIsOverflowing(gameConfigDisplayRef.current);
  const scrollbarSize = useScrollbarSize();

  if (!lobbyUiState.currentGameRoom) return <p>...</p>;
  const bothPlayersReady = lobbyUiState.currentGameRoom.playersReady.host && lobbyUiState.currentGameRoom?.playersReady.challenger;

  function sendEditConfigRequest(key: string, value: any) {
    socket.emit(SocketEventsFromClient.GAME_ROOM_CONFIG_EDIT_REQUEST, { [key]: value });
  }

  const { acceleration, topSpeed, approachingDestinationBrakingSpeed, hardBrakingSpeed, turningSpeed, gameSpeedIncrementRate, speedModifier } =
    lobbyUiState.currentGameRoom.battleRoomGameConfig;

  //   console.log("isOverflowing: ", isOverflowing);

  return (
    <div className="game-config-display" ref={gameConfigDisplayRef}>
      <div className={`game-config-display__options ${isOverflowing && scrollbarSize.width && "game-config-display__options--overflow-padding"}`}>
        <div className="game-config-display__option-column">
          <GameConfigSelect title="Acceleration">
            <SelectDropdown
              title="Acceleration"
              options={[
                { title: "Very slow", value: 0.05 },
                { title: "Slow", value: 0.1 },
                { title: "Moderate", value: 0.2 },
                { title: "Fast", value: 0.5 },
                { title: "Very fast", value: 1 },
              ]}
              value={acceleration}
              setValue={(value) => sendEditConfigRequest("acceleration", value)}
              disabled={bothPlayersReady || !isHost}
              extraStyles="game-room-menu__select-input"
            />
          </GameConfigSelect>
          <GameConfigSelect title="Top speed">
            <SelectDropdown
              title="Top speed"
              options={[
                { title: "Very slow", value: 2 },
                { title: "Slow", value: 3 },
                { title: "Moderate", value: 5 },
                { title: "Fast", value: 6 },
                { title: "Very fast", value: 8 },
              ]}
              value={topSpeed}
              setValue={(value) => sendEditConfigRequest("topSpeed", value)}
              disabled={bothPlayersReady || !isHost}
              extraStyles="game-room-menu__select-input"
            />
          </GameConfigSelect>
        </div>
        <div className="game-config-display__option-column">
          <GameConfigSelect title="Approach braking">
            <SelectDropdown
              title="Approach braking"
              options={[
                { title: "Very soft", value: 0.02 },
                { title: "Soft", value: 0.05 },
                { title: "Moderate", value: 0.1 },
                { title: "Hard", value: 0.2 },
                { title: "Very hard", value: 0.4 },
              ]}
              value={approachingDestinationBrakingSpeed}
              setValue={(value) => sendEditConfigRequest("approachingDestinationBrakingSpeed", value)}
              disabled={bothPlayersReady || !isHost}
              extraStyles="game-room-menu__select-input"
            />
          </GameConfigSelect>
          <GameConfigSelect title="Destination braking">
            <SelectDropdown
              title="Destination braking"
              options={[
                { title: "Very soft", value: 0.05 },
                { title: "Soft", value: 0.1 },
                { title: "Moderate", value: 0.2 },
                { title: "Hard", value: 0.3 },
                { title: "Instant", value: 1 },
              ]}
              value={hardBrakingSpeed}
              setValue={(value) => sendEditConfigRequest("hardBrakingSpeed", value)}
              disabled={bothPlayersReady || !isHost}
              extraStyles="game-room-menu__select-input"
            />
          </GameConfigSelect>
        </div>
        <div className="game-config-display__option-column">
          <GameConfigSelect title="Turning">
            <SelectDropdown
              title="Turning"
              options={[
                { title: "Very slow", value: 0.2 },
                { title: "Slow", value: 0.5 },
                { title: "Moderate", value: 0.7 },
                { title: "Instant", value: 1 },
              ]}
              value={turningSpeed}
              setValue={(value) => sendEditConfigRequest("turningSpeed", value)}
              disabled={bothPlayersReady || !isHost}
              extraStyles="game-room-menu__select-input"
            />
          </GameConfigSelect>
          <GameConfigSelect title="Game speed increment rate">
            <SelectDropdown
              title="Game speed increment rate"
              options={[
                { title: "None", value: 0 },
                { title: "Low", value: 0.05 },
                { title: "Moderate", value: 0.1 },
                { title: "High", value: 0.2 },
                { title: "Very high", value: 0.3 },
              ]}
              value={gameSpeedIncrementRate}
              setValue={(value) => sendEditConfigRequest("gameSpeedIncrementRate", value)}
              disabled={bothPlayersReady || !isHost}
              extraStyles="game-room-menu__select-input"
            />
          </GameConfigSelect>
        </div>
      </div>

      <button type="button" className="button game-config-display-button" onClick={() => setParentDisplay(false)}>
        <ArrowShape className="game-config-display-button-icon" />
      </button>
    </div>
  );
}

export default GameConfigDisplay;
