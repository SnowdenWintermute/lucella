import { UserRole } from "../../../../common";
import createRandomUserData from "./createRandomUserData";
import createTestUser from "./createTestUser";

export default async function createSequentialEloTestUsers(numberToCreate: number, eloOfFirst: number, eloBetweenEach: number) {
  let currUserElo = eloOfFirst;
  const promises = [];
  for (let i = numberToCreate; i > 0; i -= 1) {
    const { wins, losses } = createRandomUserData();
    promises.push(createTestUser(`test-${currUserElo}`, `test-${currUserElo}@gmail.com`, "111111", UserRole.USER, currUserElo, wins, losses));
    currUserElo += eloBetweenEach;
  }
  await Promise.all(promises);
}
