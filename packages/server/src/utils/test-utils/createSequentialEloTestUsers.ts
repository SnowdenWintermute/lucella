import { UserRole } from "../../../../common";
import createTestUser from "./createTestUser";

export default async function createSequentialEloTestUsers(numberToCreate: number, eloOfFirst: number, eloBetweenEach: number) {
  let currUserElo = eloOfFirst;
  const promises = [];
  for (let i = numberToCreate; i > 0; i -= 1) {
    console.log("creating test user with elo of: ", currUserElo);
    promises.push(createTestUser(`test-${currUserElo}`, `test-${currUserElo}@gmail.com`, "111111", UserRole.USER, currUserElo, 1, 1));
    currUserElo += eloBetweenEach;
  }
  await Promise.all(promises);
}
