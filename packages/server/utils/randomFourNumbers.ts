export default function randomFourNumbers(): number[] {
  let randomNumbers: number[] = [];
  for (let i = 4; i > 0; i--) {
    randomNumbers.push(Math.floor(Math.random() * Math.floor(9)));
  }
  return randomNumbers;
}
