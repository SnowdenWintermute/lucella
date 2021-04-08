import cloneDeep from "lodash.clonedeep";

export default ({
  gameData,
  lastServerGameUpdate,
  playerRole,
}) => {
  if (lastServerGameUpdate) 
    Object.keys(lastServerGameUpdate).forEach((key) => {
      if (key !== "orbs") gameData.gameState[key] = cloneDeep(lastServerGameUpdate[key])
  }
}