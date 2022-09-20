const randomFourNumbers = require("./randomFourNumbers");

export default function makeRandomAnonUsername(): string {
  // give them a rand 4 string and if duplicate run it again - danger of loop?
  const randomNums = randomFourNumbers().join("");
  const randomAnonUsername = "Anon" + randomNums;
  return randomAnonUsername;
}
