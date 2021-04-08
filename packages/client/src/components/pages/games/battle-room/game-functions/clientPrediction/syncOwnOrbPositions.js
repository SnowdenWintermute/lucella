import cloneDeep from "lodash.clonedeep";
import sendOrbTowardHeading from "./sendOrbTowardHeading";
// import isEqual from 'lodash.isequal'

export const syncOwnOrbPositions = ({
  gameData,
  lastServerGameUpdate,
  lastServerUpdateAppliedInfo,
  numberOfLastCommandUpdateFromServer,
  playerRole,
}) => {
  if (!lastServerGameUpdate) return
  // set own orbs to last position received from server
  const timeSinceLastUpdateApplied = Date.now() - lastServerUpdateAppliedInfo.clientPlayer.timestamp
  if (lastServerUpdateAppliedInfo.clientPlayer.number < numberOfLastCommandUpdateFromServer || timeSinceLastUpdateApplied > 1200) {
    Object.keys(lastServerGameUpdate).forEach((key) => {
      if (key === "orbs") {
        gameData.gameState.orbs[playerRole].forEach((orb, i) => {
          Object.keys(lastServerGameUpdate.orbs[playerRole][i]).forEach(orbKey => {
            if (orb.hasOwnProperty(orbKey)) {
              orb[orbKey] = cloneDeep(lastServerGameUpdate.orbs[playerRole][i][orbKey])
            }
          })
          // move orbs based on how long it has been since that update
          // const dateString = Date.now().toString()
          // const lastFourPlacesOfDateNow = parseInt(dateString.slice(dateString.length - 4))
          // const deltaTSinceLastServerUpdateApplied = lastFourPlacesOfDateNow - lastServerGameUpdate.lastFourPlacesOfLastServerUpdateTimestamp > 0 ? lastFourPlacesOfDateNow - lastServerGameUpdate.lastFourPlacesOfLastServerUpdateTimestamp : lastFourPlacesOfDateNow + 10000 - lastServerGameUpdate.lastFourPlacesOfLastServerUpdateTimestamp;
          // console.log(deltaTSinceLastServerUpdateApplied)
          // sendOrbTowardHeading({ orb, gameData, deltaT: deltaTSinceLastServerUpdateApplied })
        })
      } else {
        gameData.gameState[key] = cloneDeep(
          lastServerGameUpdate[key],
        );
      }
    });
    lastServerUpdateAppliedInfo.clientPlayer.number = numberOfLastCommandUpdateFromServer;
    lastServerUpdateAppliedInfo.clientPlayer.timestamp = Date.now();
  }
};
