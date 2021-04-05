import cloneDeep from "lodash.clonedeep";
import isEqual from 'lodash.isequal'

export const syncGameState = ({
  gameData,
  lastServerGameUpdate,
  numberOfLastServerUpdateApplied,
  numberOfLastCommandUpdateFromServer,
  playerRole,
}) => {
  if (lastServerGameUpdate) {
    Object.keys(lastServerGameUpdate).forEach((key) => {
      if (!isEqual(lastServerGameUpdate[key], gameData.gameState[key]))
        if (key === "orbs")
          gameData.gameState.orbs[playerRole + "Orbs"].forEach((orb, i) => {
            Object.keys(orb).forEach(property => {
              const lastUpdateOrbProp = lastServerGameUpdate.orbs[playerRole + "Orbs"][i][property]
              if (lastUpdateOrbProp) orb[property] = lastUpdateOrbProp
            })
          })
        else gameData.gameState[key] = cloneDeep(lastServerGameUpdate[key])
    });
    numberOfLastServerUpdateApplied.current = numberOfLastCommandUpdateFromServer;
  }
};
