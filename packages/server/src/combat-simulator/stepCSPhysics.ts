import Matter from "matter-js";
import { CSEventsFromServer, CombatSimulator, renderRate } from "../../../common";
import { LucellaServer } from "../LucellaServer";

export default function stepCSPhysics(server: LucellaServer, cs: CombatSimulator, firstStep?: boolean) {
  const { io } = server;
  if (!cs.physicsEngine) return;
  Matter.Engine.update(cs.physicsEngine);

  Object.keys(cs.players).forEach((socketId) => {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
      delete cs.players[socketId];
    } else {
      const entities = {
        playerControlled: {},
      };

      Object.entries(cs.entities.playerControlled).forEach(([key, value]) => {
        // entities.playerControlled[key]
      });
      socket.emit(CSEventsFromServer.CS_GAME_PACKET, cs.entities);
    }
  });
  console.log(cs.intervals.physics);
  if (cs.intervals.physics || firstStep) cs.intervals.physics = setTimeout(() => stepCSPhysics(server, cs), renderRate);
}
