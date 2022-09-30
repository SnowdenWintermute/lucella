import { physicsTickRate } from "../../../consts";
import ServerState from "../../../interfaces/ServerState";
// import handleScoringPoints from "./handleScoringPoints"
// import processCommandQueue from "./processCommandQueue'

export default function (serverState: ServerState, gameName: string) {
  const game = serverState.games[gameName];
  return setInterval(() => {
    if (!game) return new Error("tried to update physics in a game that wasn't found");
    // processCommandQueue({ gameData })
    // const deltaT = Date.now() - gameData.gameState.lastUpdateTimestamp
    // moveOrbs({ gameData, deltaT });
    // handleOrbCollisions({ gameData });
    // handleScoringPoints({ application, gameName });
    // gameData.gameState.lastUpdateTimestamp = Date.now();
  }, physicsTickRate);
}
