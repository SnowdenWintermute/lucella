import cloneDeep from "lodash.clonedeep";
import isEqual from 'lodash.isequal'

export const syncGameState = ({
  gameData,
  lastServerGameUpdate,
  numberOfLastServerUpdateApplied,
  numberOfLastCommandUpdateFromServer,
  playerRole,
}) => {
  console.log("lastServerGameUpdate", lastServerGameUpdate)
  console.log(numberOfLastServerUpdateApplied.current, numberOfLastCommandUpdateFromServer)

  if (lastServerGameUpdate && (!numberOfLastServerUpdateApplied.current ||
    numberOfLastServerUpdateApplied.current !== numberOfLastCommandUpdateFromServer)) {
    Object.keys(lastServerGameUpdate).forEach((key) => {
      if (!isEqual(lastServerGameUpdate[key], gameData.gameState[key]))
        if (key === "orbs")
          gameData.gameState.orbs[playerRole + "Orbs"] = cloneDeep(lastServerGameUpdate.orbs[playerRole + "Orbs"]);
        else gameData.gameState[key] = cloneDeep(lastServerGameUpdate[key])
    });
    numberOfLastServerUpdateApplied.current = numberOfLastCommandUpdateFromServer;
    console.log("newGameState: ", gameData.gameState)
  }
};
