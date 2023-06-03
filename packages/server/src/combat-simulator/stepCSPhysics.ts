import Matter from "matter-js";
import { CSEventsFromServer, CombatSimulator, packCSGameStateDeltas, renderRate } from "../../../common";
import { LucellaServer } from "../LucellaServer";

export default function stepCSPhysics(server: LucellaServer, cs: CombatSimulator, firstStep?: boolean) {
  const { io } = server;
  if (!cs.physicsEngine) return;
  Matter.Engine.update(cs.physicsEngine);

  Object.keys(cs.players).forEach((socketId) => {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) return delete cs.players[socketId];

    const entities = {
      playerControlled: {},
    };

    const serialized = packCSGameStateDeltas(cs);
    socket.emit(CSEventsFromServer.CS_GAME_PACKET, serialized);
  });
  if (cs.intervals.physics || firstStep) cs.intervals.physics = setTimeout(() => stepCSPhysics(server, cs), renderRate);
}
