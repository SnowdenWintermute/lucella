export default (stackedOrbHighestIndex, orb, playerOrbs) => {
  if (!stackedOrbHighestIndex) {
    stackedOrbHighestIndex = orb.num;
    orb.isSelected = true;
  } else if (orb.num > stackedOrbHighestIndex) {
    playerOrbs.forEach((orb) => {
      orb.isSelected = false;
    });
    stackedOrbHighestIndex = orb.num;
    orb.isSelected = true;
  }
}