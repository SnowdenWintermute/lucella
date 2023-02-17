/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import { Socket } from "socket.io-client";
import { BattleRoomGame, PlayerRole, Point, SelectOrbs, SocketEventsFromClient } from "../../../../../common";
import newOrbSelections from "../game-functions/commandHandlers/newOrbSelections";
import serializeInput from "../../../protobuf-utils/serialize-input";

export default function mouseLeaveHandler(currentGame: BattleRoomGame, socket: Socket, playerRole: PlayerRole | null) {
  const { mouseData } = currentGame;
  if (!mouseData || !mouseData.position || !playerRole) return console.log("missing arguments from mouseLeaveHandler");
  mouseData.mouseOnScreen = false;
  if (mouseData.leftCurrentlyPressed) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAt = new Point(mouseData.position.x, mouseData.position.y);
    const input = new SelectOrbs(
      { orbIds: newOrbSelections(mouseData, currentGame, playerRole) },
      (currentGame.netcode.lastClientInputNumber += 1),
      playerRole
    );
    currentGame.queues.client.localInputs.push(input);
    const serialized = serializeInput(input);
    socket.emit(SocketEventsFromClient.NEW_INPUT, serialized);
  }
}
