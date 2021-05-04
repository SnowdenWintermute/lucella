const GameEventTypes = require('../consts/GameEventTypes')
const orbsIntersecting = require('./orbsIntersecting')

module.exports = ({ gameData, handleAndQueueNewGameEvent, commonEventHandlerProps }) => {
  gameData.gameState.orbs.host.forEach((orb, i) => {
    let orbsCollidedIndices = [];
    if (!orb.isGhost) {
      for (let i = 0; i < gameData.gameState.orbs.challenger.length; i++) {
        const orbToCheckIntersectionWith = gameData.gameState.orbs.challenger[i]
        if (
          orbsIntersecting({ orb, orbToCheckIntersectionWith }) &&
          !orbToCheckIntersectionWith.isGhost
        ) {
          orb.isGhost = true
          if (handleAndQueueNewGameEvent) {
            console.log("adding collision to event queue")
            handleAndQueueNewGameEvent({ // for client prediction
              type: GameEventTypes.ORB_COLLISION,
              props: { hostOrbIndex: i, challengerOrbIndex: orbsCollidedIndices[0] },
              commonEventHandlerProps
            })
          }
          return orbToCheckIntersectionWith.isGhost = true
        }
      }
    }
  });
}