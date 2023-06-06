/* eslint-disable no-use-before-define */
import { Socket } from "socket.io-client";
import { CSEventsFromClient, CSGameState, CombatSimulator, renderRate } from "../../../../common";
import determineCSUserInputDeltas from "./determineCSUserInputDeltas";
import packCSUserInputs from "./packCSUserInputs";
import cloneDeep from "lodash.clonedeep";

export default function createCSClientInterval(socket: Socket, cs: CombatSimulator) {
  return setTimeout(() => stepCSClient(socket, cs), renderRate);
}

function stepCSClient(socket: Socket, cs: CombatSimulator) {
  if (!cs.netcode.prevGameState) {
    console.log("setting inital game state");
    cs.netcode.prevGameState = new CSGameState();
  }
  const deltas = determineCSUserInputDeltas(cs);
  const serializedInputState = packCSUserInputs(deltas);
  cs.netcode.prevGameState.inputs = cloneDeep(cs.inputState);
  socket.emit(CSEventsFromClient.SENDS_INPUTS, serializedInputState);
  cs.intervals.physics = setTimeout(() => stepCSClient(socket, cs), renderRate);
}
