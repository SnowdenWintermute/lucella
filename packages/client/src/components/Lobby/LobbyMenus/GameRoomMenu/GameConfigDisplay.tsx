import { Socket } from "socket.io-client";
import React, { useRef } from "react";
import RadioBar from "../../../common-components/RadioBar";
import { useAppSelector } from "../../../../redux/hooks";
import { BattleRoomGameOptions, SocketEventsFromClient } from "../../../../../../common";
import useElementIsOverflowing from "../../../../hooks/useElementIsOverflowing";
import useScrollbarSize from "../../../../hooks/useScrollbarSize";

function GameConfigDisplay({ socket, isHost }: { socket: Socket; isHost: boolean }) {
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);
  const gameConfigDisplayRef = useRef<HTMLDivElement>(null);
  const isOverflowing = useElementIsOverflowing(gameConfigDisplayRef.current);
  const scrollbarSize = useScrollbarSize();

  if (!lobbyUiState.gameRoom) return <p>...</p>;
  const bothPlayersReady = lobbyUiState.gameRoom.playersReady.host && lobbyUiState.gameRoom?.playersReady.challenger;

  function sendEditConfigRequest(key: string, value: any) {
    socket.emit(SocketEventsFromClient.GAME_ROOM_CONFIG_EDIT_REQUEST, { [key]: value });
  }

  const { acceleration, topSpeed, hardBrakingSpeed, turningSpeedModifier, speedIncrementRate } = lobbyUiState.gameRoom.battleRoomGameConfigOptionIndices;

  return (
    <div className="game-config-display" ref={gameConfigDisplayRef}>
      <div className={`game-config-display__options ${isOverflowing && scrollbarSize.width && "game-config-display__options--overflow-padding"}`}>
        <div className="game-config-display__option-column">
          <RadioBar
            title="Acceleration"
            options={BattleRoomGameOptions.acceleration.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={acceleration}
            setValue={(value) => sendEditConfigRequest("acceleration", value)}
            disabled={bothPlayersReady || !isHost}
            extraStyles="game-config-display__radio-input"
          />
          <RadioBar
            title="Top speed"
            options={BattleRoomGameOptions.topSpeed.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={topSpeed}
            setValue={(value) => sendEditConfigRequest("topSpeed", value)}
            disabled={bothPlayersReady || !isHost}
            extraStyles="game-config-display__radio-input"
          />
        </div>
        <div className="game-config-display__option-column">
          <RadioBar
            title="Turning modifier"
            options={BattleRoomGameOptions.turningSpeedModifier.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={turningSpeedModifier}
            setValue={(value) => sendEditConfigRequest("turningSpeedModifier", value)}
            disabled={bothPlayersReady || !isHost}
            extraStyles="game-config-display__radio-input"
          />
          <RadioBar
            title="Braking"
            options={BattleRoomGameOptions.hardBrakingSpeed.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={hardBrakingSpeed}
            setValue={(value) => sendEditConfigRequest("hardBrakingSpeed", value)}
            disabled={bothPlayersReady || !isHost}
            extraStyles="game-config-display__radio-input"
          />
        </div>
        <div className="game-config-display__option-column">
          <RadioBar
            title="Speed increment"
            options={BattleRoomGameOptions.speedIncrementRate.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={speedIncrementRate}
            setValue={(value) => sendEditConfigRequest("speedIncrementRate", value)}
            disabled={bothPlayersReady || !isHost}
            extraStyles="game-config-display__radio-input"
            tooltip="How much the game speed increases after each point is scored"
          />
        </div>
      </div>
    </div>
  );
}

export default GameConfigDisplay;
