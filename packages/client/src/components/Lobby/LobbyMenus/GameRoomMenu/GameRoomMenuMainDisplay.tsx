import React from "react";
import { Socket } from "socket.io-client";
import { BattleRoomGameOptions, GameRoom, PlayerRole, SocketEventsFromClient, SocketMetadata } from "../../../../../../common";
import { APP_TEXT } from "../../../../consts/app-text";
import { ARIA_LABELS } from "../../../../consts/aria-labels";
import { BUTTON_NAMES } from "../../../../consts/button-names";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { setPlayerReadyLoading } from "../../../../redux/slices/lobby-ui-slice";
import SelectDropdown from "../../../common-components/SelectDropdown";

function PlayerWithReadyStatus({ player, playerReady, playerRole }: { player: SocketMetadata | null; playerReady: boolean; playerRole: PlayerRole }) {
  return (
    <div className="game-room-menu__player-with-ready-status">
      <span className="game-room-menu__player" aria-label={ARIA_LABELS.GAME_ROOM.PLAYER_NAME(playerRole)}>
        {player ? player.associatedUser.username : "..."}
      </span>
      {player && (
        <span
          aria-label={ARIA_LABELS.GAME_ROOM.PLAYER_READY_STATUS(playerRole)}
          className={`game-room-menu__player-ready-badge ${playerReady ? "game-room-menu__player-ready-badge--ready" : ""}`}
        >
          {playerReady ? APP_TEXT.GAME_ROOM.PLAYER_READY_STATUS.READY : APP_TEXT.GAME_ROOM.PLAYER_READY_STATUS.NOT_READY}
        </span>
      )}
      {!player && <span aria-label={ARIA_LABELS.GAME_ROOM.PLAYER_READY_STATUS(playerRole)} />}
    </div>
  );
}

function GameRoomMenuMainDisplay({ socket, gameRoom, isHost }: { socket: Socket; gameRoom: GameRoom; isHost: boolean }) {
  const dispatch = useAppDispatch();
  const lobbyUiState = useAppSelector((state) => state.lobbyUi);

  const handleReadyClick = () => {
    socket.emit(SocketEventsFromClient.CLICKS_READY);
    dispatch(setPlayerReadyLoading(true));
  };

  function sendEditConfigRequest(key: string, value: any) {
    socket.emit(SocketEventsFromClient.GAME_ROOM_CONFIG_EDIT_REQUEST, { [key]: value });
  }

  const { players, playersReady } = gameRoom;
  const numberOfRoundsRequiredToWin =
    BattleRoomGameOptions.numberOfRoundsRequiredToWin.options[gameRoom.battleRoomGameConfigOptionIndices.numberOfRoundsRequiredToWin].value;
  const readableRoundsRequired = `Best of ${numberOfRoundsRequiredToWin * 2 - 1}`;

  return (
    <>
      <h3 className="lobby-menu__header">
        {APP_TEXT.GAME_ROOM.GAME_NAME_HEADER}
        {gameRoom.gameName}
      </h3>
      <div className="game-room-menu__players">
        <PlayerWithReadyStatus player={players.host} playerReady={playersReady.host} playerRole={PlayerRole.HOST} />
        <span className="game-room-menu__vs">vs.</span>
        <PlayerWithReadyStatus player={players.challenger} playerReady={playersReady.challenger} playerRole={PlayerRole.CHALLENGER} />
      </div>
      {!gameRoom?.isRanked && (
        <div className="game-room-menu__buttons">
          {isHost && (
            <SelectDropdown
              title="number of rounds required to win"
              options={BattleRoomGameOptions.numberOfRoundsRequiredToWin.options.map((option, i) => {
                return { title: option.title, value: i };
              })}
              value={lobbyUiState.gameRoom?.battleRoomGameConfigOptionIndices.numberOfRoundsRequiredToWin}
              setValue={(value) => sendEditConfigRequest("numberOfRoundsRequiredToWin", value)}
              disabled={lobbyUiState.gameRoom?.playersReady.host && lobbyUiState.gameRoom?.playersReady.challenger}
              extraStyles="game-room-menu__select-input"
            />
          )}
          {!isHost && <div className="button button--transparent game-room-menu__rounds-required-to-win-display">{readableRoundsRequired}</div>}
          <button
            type="button"
            className="button game-room-menu__ready-button button--accent"
            onClick={handleReadyClick}
            disabled={lobbyUiState.playerReadyLoading}
          >
            {BUTTON_NAMES.GAME_ROOM.READY}
          </button>
        </div>
      )}
    </>
  );
}

export default GameRoomMenuMainDisplay;
