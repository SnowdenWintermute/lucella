import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";

export const syncGameState = ({
  gameData,
  lastServerGameUpdate,
  numberOfLastServerUpdateApplied,
  numberOfLastCommandUpdateFromServer,
  playerRole,
}) => {
  if (lastServerGameUpdate.gameState) {
    if (
      !numberOfLastServerUpdateApplied ||
      numberOfLastServerUpdateApplied !== numberOfLastCommandUpdateFromServer
    ) {
      Object.keys(lastServerGameUpdate.gameState).forEach((key) => {
        if (
          !isEqual(lastServerGameUpdate.gameState[key], gameData.gameState[key])
        ) {
          if (key === "orbs") {
            gameData.gameState.orbs[playerRole + "Orbs"] = cloneDeep(
              lastServerGameUpdate.gameState.orbs[playerRole + "Orbs"],
            );
          } else {
            gameData.gameState[key] = cloneDeep(
              lastServerGameUpdate.gameState[key],
            );
          }
        }
      });
      numberOfLastServerUpdateApplied = numberOfLastCommandUpdateFromServer;
    }
  }
};
