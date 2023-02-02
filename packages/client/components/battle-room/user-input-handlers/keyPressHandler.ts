/* eslint-disable no-param-reassign */
import { Socket } from "socket.io-client";
import {
  BattleRoomGame,
  LineUpOrbsHorizontallyAtMouseY,
  PlayerRole,
  Point,
  SelectOrbAndAssignDestination,
  SelectOrbs,
  SocketEventsFromClient,
} from "../../../../common";
import serializeInput from "../../../protobuf-utils/serialize-input";
// const replicator = new (require("replicator"))();

export default (e: KeyboardEvent, game: BattleRoomGame, socket: Socket, playerRole: PlayerRole | null) => {
  if (!playerRole) return;
  const keyPressed = parseInt(e.key, 10);
  if ((keyPressed < 1 || keyPressed > 7) && keyPressed !== 0) return;
  const { mouseData } = game;
  if (!mouseData.position) return;

  let input;
  if (keyPressed === 0) game.debug.mode = game.debug.mode < 2 ? game.debug.mode + 1 : 0;
  else if (keyPressed >= 1 && keyPressed <= 5)
    input = new SelectOrbAndAssignDestination(
      {
        orbIds: [keyPressed],
        mousePosition: new Point(mouseData.position.x, mouseData.position.y),
      },
      (game.netcode.lastClientInputNumber += 1),
      playerRole
    );
  else if (keyPressed === 7) input = new LineUpOrbsHorizontallyAtMouseY(mouseData.position.y, (game.netcode.lastClientInputNumber += 1), playerRole);
  else if (keyPressed === 6)
    input = new SelectOrbs({ orbIds: Object.values(game.orbs[playerRole]).map((orb) => orb.id) }, (game.netcode.lastClientInputNumber += 1), playerRole);
  if (!input) return;
  game.queues.client.localInputs.push(input);

  const serialized = serializeInput(input);
  socket.emit(SocketEventsFromClient.NEW_INPUT, serialized);
};
