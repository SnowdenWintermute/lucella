/* eslint-disable no-param-reassign */
import { Socket } from "socket.io-client";
import {
  BattleRoomGame,
  LineUpOrbsHorizontallyAtMouseY,
  orbWaypointListSizeLimit,
  PlayerRole,
  Point,
  SelectOrbAndAssignDestination,
  SelectOrbs,
  SocketEventsFromClient,
} from "../../../../../common";
import serializeInput from "../../../protobuf-utils/serialize-input";

export default (e: KeyboardEvent, game: BattleRoomGame, socket: Socket, playerRole: PlayerRole | null) => {
  if (!playerRole) return;

  if (e.key === " ") game.waypointKeyIsPressed = true;

  const numberKeyPressed = parseInt(e.key, 10);

  if ((numberKeyPressed < 1 || numberKeyPressed > 7) && numberKeyPressed !== 0) return;
  const { mouseData } = game;
  if (!mouseData.position) return;

  let input;
  if (numberKeyPressed === 0) game.debug.mode = game.debug.mode < 2 ? game.debug.mode + 1 : 0;
  else if (numberKeyPressed >= 1 && numberKeyPressed <= 5) {
    const selectedOrb = game.orbs[playerRole][`${playerRole}-orb-${numberKeyPressed}`];
    if (game.waypointKeyIsPressed && selectedOrb.waypoints.length < orbWaypointListSizeLimit) {
      selectedOrb.waypoints.push(new Point(mouseData.position.x, mouseData.position.y));
    } else if (!game.waypointKeyIsPressed) {
      selectedOrb.waypoints = [];
      input = new SelectOrbAndAssignDestination(
        {
          orbIds: [numberKeyPressed],
          mousePosition: new Point(mouseData.position.x, mouseData.position.y),
        },
        (game.netcode.lastClientInputNumber += 1),
        playerRole
      );
    }
  } else if (numberKeyPressed === 7) input = new LineUpOrbsHorizontallyAtMouseY(mouseData.position.y, (game.netcode.lastClientInputNumber += 1), playerRole);
  else if (numberKeyPressed === 6)
    input = new SelectOrbs({ orbIds: Object.values(game.orbs[playerRole]).map((orb) => orb.id) }, (game.netcode.lastClientInputNumber += 1), playerRole);
  if (!input) return;
  game.queues.client.localInputs.push(input);

  const serialized = serializeInput(input);
  socket.emit(SocketEventsFromClient.NEW_INPUT, serialized);
};
