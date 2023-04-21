import { Socket } from "socket.io-client";
import React, { useRef } from "react";
import RadioBar from "../../../common-components/RadioBar";
import { useAppSelector } from "../../../../redux/hooks";
import { SocketEventsFromClient } from "../../../../../../common";
import useElementIsOverflowing from "../../../../hooks/useElementIsOverflowing";
import useScrollbarSize from "../../../../hooks/useScrollbarSize";

function GameConfigDisplay({ socket, isHost }: { socket: Socket; isHost: boolean }) {
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const gameConfigDisplayRef = useRef<HTMLDivElement>(null);
  const isOverflowing = useElementIsOverflowing(gameConfigDisplayRef.current);
  const scrollbarSize = useScrollbarSize();

  if (!lobbyUiState.currentGameRoom) return <p>...</p>;
  const bothPlayersReady = lobbyUiState.currentGameRoom.playersReady.host && lobbyUiState.currentGameRoom?.playersReady.challenger;

  function sendEditConfigRequest(key: string, value: any) {
    socket.emit(SocketEventsFromClient.GAME_ROOM_CONFIG_EDIT_REQUEST, { [key]: value });
  }

  const { acceleration, topSpeed, approachingDestinationBrakingSpeed, hardBrakingSpeed, turningDelay, gameSpeedIncrementRate, speedModifier } =
    lobbyUiState.currentGameRoom.battleRoomGameConfig;

  return (
    <div className="game-config-display" ref={gameConfigDisplayRef}>
      <div className={`game-config-display__options ${isOverflowing && scrollbarSize.width && "game-config-display__options--overflow-padding"}`}>
        <div className="game-config-display__option-column">
          <RadioBar
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
            extraStyles="game-config-display__radio-input"
          />
          <RadioBar
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
            extraStyles="game-config-display__radio-input"
          />
        </div>
        <div className="game-config-display__option-column">
          <RadioBar
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
            extraStyles="game-config-display__radio-input"
          />
          <RadioBar
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
            extraStyles="game-config-display__radio-input"
          />
        </div>
        <div className="game-config-display__option-column">
          <RadioBar
            title="Turning"
            options={[
              { title: "Very slow", value: 2 },
              { title: "Slow", value: 1.5 },
              { title: "Moderate", value: 1 },
              { title: "Instant", value: 0 },
            ]}
            value={turningDelay}
            setValue={(value) => sendEditConfigRequest("turningDelay", value)}
            disabled={bothPlayersReady || !isHost}
            extraStyles="game-config-display__radio-input"
          />
          <RadioBar
            title="Speed increment rate"
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
            extraStyles="game-config-display__radio-input"
          />
        </div>
      </div>
    </div>
  );
}

export default GameConfigDisplay;
