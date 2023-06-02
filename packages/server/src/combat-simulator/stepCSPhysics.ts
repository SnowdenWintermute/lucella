import Matter from "matter-js";
import { CSEventsFromServer, CombatSimulator, renderRate } from "../../../common";
import { LucellaServer } from "../LucellaServer";

export default function stepCSPhysics(server: LucellaServer, cs: CombatSimulator, firstStep?: boolean) {
  console.log("stepping cs physics");
  const { io } = server;
  if (!cs.physicsEngine) return;
  Matter.Engine.update(cs.physicsEngine);

  Object.keys(cs.players).forEach((socketId) => {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) {
      delete cs.players[socketId];
    } else {
      console.log("sending test packet to socket ", socket.id);
      socket.emit(CSEventsFromServer.CS_GAME_PACKET, `packet from ${cs.gameName}`);
    }
  });
  console.log(cs.intervals.physics);
  if (cs.intervals.physics || firstStep) cs.intervals.physics = setTimeout(() => stepCSPhysics(server, cs), renderRate);
}
