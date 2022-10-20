import { physicsTickRate } from "../../../../../common";
import ServerState from "../../../interfaces/ServerState";
// import handleScoringPoints from "./handleScoringPoints"
// import processCommandQueue from "./processCommandQueue'

export default function (serverState: ServerState, gameName: string) {
  const game = serverState.games[gameName];
  return setInterval(() => {
    if (!game) return new Error("tried to update physics in a game that wasn't found");
    game.queues.server.receivedInputs.forEach(() => {
      console.log(game.queues.server.receivedInputs.shift());
    });
  }, physicsTickRate);
}
