function randomFourNumbers(): number[] {
  let randomNumbers: number[] = [];
  for (let i = 4; i > 0; i--) {
    randomNumbers.push(Math.floor(Math.random() * Math.floor(9)));
  }
  return randomNumbers;
}

export default function makeRandomAnonUsername(): string {
  // give them a rand 4 string and if duplicate run it again - danger of loop?
  const randomNums = randomFourNumbers().join("");
  const randomAnonUsername = "Anon" + randomNums;
  return randomAnonUsername;
}
