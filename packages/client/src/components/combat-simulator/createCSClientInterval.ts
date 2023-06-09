/* eslint-disable no-use-before-define */
import { Socket } from "socket.io-client";
import cloneDeep from "lodash.clonedeep";
import { ArcRotateCamera, Scene } from "@babylonjs/core";
import { CSEventsFromClient, CSGameState, CombatSimulator, renderRate } from "../../../../common";
import determineCSUserInputDeltas from "./determineCSUserInputDeltas";
import packCSUserInputs from "./packCSUserInputs";

export default function createCSClientInterval(socket: Socket, cs: CombatSimulator, scene: Scene) {
  return setTimeout(() => stepCSClient(socket, cs, scene), renderRate);
}

function stepCSClient(socket: Socket, cs: CombatSimulator, scene: Scene) {
  if (!cs.netcode.prevGameState) {
    console.log("setting inital game state");
    cs.netcode.prevGameState = new CSGameState();
  }

  // const numIdsToRemove = cs.meshIdsToRemove.length;
  // for (let i = 0; i <= numIdsToRemove; i += 1) {
  //   const id = cs.meshIdsToRemove.shift();
  //   const playerBox = scene.getMeshById(`${id}-player-box`);
  //   if (playerBox) scene.removeMesh(playerBox);
  //   const playerRectangularPrism = scene.getMeshById(`${id}-rectangular-prism`);
  //   if (playerRectangularPrism) scene.removeMesh(playerRectangularPrism);
  //   const playerPoly = scene.getMeshById(id!.toString());
  //   if (playerPoly) scene.removeMesh(playerPoly);
  // }

  if (typeof cs.playerEntityId === "number") {
    const playerEntity = cs.entities.playerControlled[cs.playerEntityId];
    const camera = scene.getCameraById("Camera");
    if (camera instanceof ArcRotateCamera) {
      cs.inputState.targetAngle = camera.alpha + Math.PI;
      const angleDiff = Number((cs.inputState.targetAngle - playerEntity.body.angle).toFixed(2));
      // console.log("ANGLE DIFF: ", angleDiff);
      if (angleDiff > 0) cs.inputState.turnLeft = true;
      else cs.inputState.turnLeft = false;
      if (angleDiff < 0) cs.inputState.turnRight = true;
      else cs.inputState.turnRight = false;
    }
  }

  const deltas = determineCSUserInputDeltas(cs);

  if (deltas) {
    const serializedInputState = packCSUserInputs(deltas);
    cs.netcode.prevGameState.inputs = cloneDeep(cs.inputState);
    socket.emit(CSEventsFromClient.SENDS_INPUTS, serializedInputState);
  }
  cs.intervals.physics = setTimeout(() => stepCSClient(socket, cs, scene), renderRate);
}
