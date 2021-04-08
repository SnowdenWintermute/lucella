const Orb = require('./Orb')

module.exports = ({ orbs, startingOrbRadius }) => {
  for (let i = 0; i < 5; i++) {
    let startingX = (i + 1) * 50 + 75;
    orbs.host.push(
      new Orb(
        startingX,
        100,
        startingOrbRadius,
        "host",
        i + 1,
        "0, 153, 0"
      )
    );
    orbs.challenger.push(
      new Orb(
        startingX,
        600,
        startingOrbRadius,
        "challenger",
        i + 1,
        "89, 0, 179"
      )
    );
  }
}