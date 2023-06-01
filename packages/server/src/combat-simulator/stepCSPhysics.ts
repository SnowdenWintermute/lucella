import Matter from "matter-js";
import { CSEventsFromServer, CombatSimulator, renderRate } from "../../../common";
import { LucellaServer } from "../LucellaServer";

export default function stepCSPhysics(server: LucellaServer, cs: CombatSimulator) {
  const { io } = server;
  if (!cs.physicsEngine) return;
  Matter.Engine.update(cs.physicsEngine);

  Object.keys(cs.players).forEach((socketId) => {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
      delete cs.players[socketId];
      return;
    }
    socket.emit(CSEventsFromServer.CS_GAME_PACKET, `packet from ${cs.gameName}`);
  });

  cs.intervals.physics = setTimeout(() => stepCSPhysics(server, cs), renderRate);
}
