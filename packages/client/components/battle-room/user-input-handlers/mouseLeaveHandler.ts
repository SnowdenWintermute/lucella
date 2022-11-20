import { Socket } from "socket.io-client";
import { BattleRoomGame, PlayerRole, Point, SelectOrbs, simulatedLagMs, simulateLag, SocketEventsFromClient } from "../../../../common";
import laggedSocketEmit from "../../../utils/laggedSocketEmit";
import newOrbSelections from "../game-functions/commandHandlers/newOrbSelections";
const replicator = new (require("replicator"))();

export default function mouseLeaveHandler(currentGame: BattleRoomGame, socket: Socket, playerRole: PlayerRole | null) {
  const { mouseData } = currentGame;
  if (!mouseData || !mouseData.position || !playerRole) return console.log("missing arguments from mouseLeaveHandler");
  mouseData.mouseOnScreen = false;
  if (mouseData.leftCurrentlyPressed) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAt = new Point(mouseData.position.x, mouseData.position.y);
    const input = new SelectOrbs(
      { orbLabels: newOrbSelections(mouseData, currentGame, playerRole) },
      (currentGame.netcode.lastClientInputNumber += 1),
      playerRole
    );
    currentGame.queues.client.localInputs.push(input);
    currentGame.queues.client.inputsFromLastTick.push(input);
    if (simulateLag) laggedSocketEmit(socket, SocketEventsFromClient.NEW_INPUT, replicator.encode(input), simulatedLagMs);
    else socket.emit(SocketEventsFromClient.NEW_INPUT, replicator.encode(input));
  }
}
