import Matter from "matter-js";
import { CSEventsFromServer, CombatSimulator, packCSGameStateDeltas, renderRate } from "../../../common";
import { LucellaServer } from "../LucellaServer";
let direction = 1;
export default function stepCSPhysics(server: LucellaServer, cs: CombatSimulator, firstStep?: boolean) {
  const { io } = server;
  if (!cs.physicsEngine) return;

  Object.values(cs.entities.playerControlled).forEach((entity) => {
    // const randomForceVector = Matter.Vector.create(0.0001, 0.0001);
    if (direction) {
      Matter.Body.setPosition(entity.body, { x: entity.body.position.x + 1, y: entity.body.position.y });
      if (entity.body.position.x >= 1000) direction = 0;
    } else {
      Matter.Body.setPosition(entity.body, { x: entity.body.position.x - 1, y: entity.body.position.y });
      if (entity.body.position.x <= 0) direction = 1;
    }
    // Matter.Body.setVelocity(entity.body, Matter.Vector.create(0, 0));
    // Matter.Body.applyForce(entity.body, entity.body.position, randomForceVector);
    // @ts-ignore
    // Matter.Body.update(entity.body, renderRate);
  });

  Matter.Engine.update(cs.physicsEngine);

  Object.keys(cs.players).forEach((socketId) => {
    const socket = io.sockets.sockets.get(socketId);
    if (!socket) return delete cs.players[socketId];
    const serialized = packCSGameStateDeltas(cs);
    socket.emit(CSEventsFromServer.CS_GAME_PACKET, serialized);
  });
  if (cs.intervals.physics || firstStep) cs.intervals.physics = setTimeout(() => stepCSPhysics(server, cs), renderRate);
}
