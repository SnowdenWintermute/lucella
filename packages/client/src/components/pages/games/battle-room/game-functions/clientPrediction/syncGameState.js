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
      if (isEqual(lastServerGameUpdate[key], gameData.gameState[key])) return
      if (key === "orbs")
        lastServerGameUpdate.orbs[playerRole].forEach((updateOrb, i) => {
          Object.keys(gameData.gameState.orbs[playerRole][i]).forEach(prop => {
            if (updateOrb.hasOwnProperty(prop))
              gameData.gameState.orbs[playerRole][i][prop] = updateOrb[prop]
          })
        })
      else gameData.gameState[key] = cloneDeep(lastServerGameUpdate[key])
    });
    numberOfLastServerUpdateApplied.current = numberOfLastCommandUpdateFromServer;
  }
};
