module.exports = (stackedOrbHighestIndex, orb, playerOrbs) => {
  if (!stackedOrbHighestIndex.current) {
    stackedOrbHighestIndex.current = orb.num;
    orb.isSelected = true;
  } else if (orb.num > stackedOrbHighestIndex.current) {
    playerOrbs.forEach((orb) => {
      orb.isSelected = false;
    });
    stackedOrbHighestIndex.current = orb.num;
    orb.isSelected = true;
  }
}