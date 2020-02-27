function randomFourNumbers() {
  let randomNumbers = [];
  for (let i = 4; i > 0; i--) {
    randomNumbers.push(Math.floor(Math.random() * Math.floor(9)));
  }
  return randomNumbers;
}

module.exports = randomFourNumbers;
