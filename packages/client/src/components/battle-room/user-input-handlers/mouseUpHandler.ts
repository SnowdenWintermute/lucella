import { Socket } from "socket.io-client";
import {
  BattleRoomGame,
  AssignDestinationsToSelectedOrbs,
  PlayerRole,
  Point,
  SelectOrbs,
  SocketEventsFromClient,
  WidthAndHeight,
  orbWaypointListSizeLimit,
} from "../../../../../common";
import newOrbSelections from "../game-functions/commandHandlers/newOrbSelections";
import serializeInput from "../../../protobuf-utils/serialize-input";

export default function mouseUpHandler(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  currentGame: BattleRoomGame,
  socket: Socket,
  playerRole: PlayerRole | null,
  canvasSize: WidthAndHeight
) {
  if (!(e.button === 0 || e.button === 2) || !playerRole) return;
  const { mouseData } = currentGame;
  if (!mouseData) return;

  const x = Math.round((e.nativeEvent.offsetX / canvasSize.width) * BattleRoomGame.baseWindowDimensions.width);
  const y = Math.round((e.nativeEvent.offsetY / canvasSize.height) * BattleRoomGame.baseWindowDimensions.height);
  if (mouseData.position === null) mouseData.position = new Point(x, y);

  let input;
  if (e.button === 2) {
    if (currentGame.waypointKeyIsPressed) {
      Object.values(currentGame.orbs[playerRole]).forEach((orb) => {
        if (!orb.isSelected || !mouseData.position) return;
        if (orb.waypoints.length < orbWaypointListSizeLimit) orb.waypoints.push(new Point(mouseData.position.x, mouseData.position.y));
      });
    } else {
      Object.values(currentGame.orbs[playerRole]).forEach((orb) => {
        if (!orb.isSelected) return;
        orb.waypoints = [];
      });
      input = new AssignDestinationsToSelectedOrbs(
        { mousePosition: new Point(mouseData.position.x, mouseData.position.y) },
        (currentGame.netcode.lastClientInputNumber += 1),
        playerRole
      );
    }
  }
  if (e.button === 0) {
    mouseData.leftCurrentlyPressed = false;
    mouseData.leftReleasedAt = new Point(mouseData.position.x, mouseData.position.y);
    input = new SelectOrbs({ orbIds: newOrbSelections(mouseData, currentGame, playerRole) }, (currentGame.netcode.lastClientInputNumber += 1), playerRole);
  }
  if (!input) return;
  currentGame.queues.client.localInputs.push(input);
  const serialized = serializeInput(input);
  socket.emit(SocketEventsFromClient.NEW_INPUT, serialized);
}
