const updateGhostOrb = require('./updateGhostOrb');
const sendOrbTowardHeading = require('./sendOrbTowardHeading');

module.exports = ({ gameData }) => {
  // go through the orbs and update each based on their current heading [orbSet is either challenger or host]
  for (let orbSet in gameData.gameState.orbs) {
    gameData.gameState.orbs[orbSet].forEach((orb) => {
      updateGhostOrb({ gameData, orbSet, orb })
      sendOrbTowardHeading({ orb, gameData })
    });
  }
}