/* eslint-disable no-use-before-define */
import { Socket } from "socket.io-client";
import { CombatSimulator, renderRate } from "../../../../common";

export default function createCSClientInterval(socket: Socket, cs: CombatSimulator) {
  return setTimeout(() => stepCSClient(socket, cs), renderRate);
}

function stepCSClient(socket: Socket, cs: CombatSimulator) {
  cs.intervals.physics = setTimeout(() => stepCSClient(socket, cs), renderRate);
}
