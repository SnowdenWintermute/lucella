/* eslint-disable no-async-promise-executor */
import { User, UserRole } from "../../../../common";
import createTestUser from "./createTestUser";

export default async function createSequentialEloTestUsers(numberToCreate: number, eloOfFirst: number, eloBetweenEach: number) {
  let currUserElo = eloOfFirst;
  console.log(`creating ${numberToCreate} test users with elos between ${eloOfFirst} and ${eloBetweenEach}`);
  const createdUsers: { [name: string]: User } = {};
  const promises = [];
  for (let i = numberToCreate; i > 0; i -= 1) {
    const thisIterationCurrUserElo = currUserElo;
    promises.push(
      new Promise(async (resolve, reject) => {
        const user = await createTestUser(
          `test-${thisIterationCurrUserElo}`,
          `test-${thisIterationCurrUserElo}@gmail.com`,
          "111111",
          UserRole.USER,
          thisIterationCurrUserElo,
          1,
          1
        );
        createdUsers[user.name] = user;
        resolve(true);
      })
    );
    currUserElo += eloBetweenEach;
  }
  await Promise.all(promises);
  return createdUsers;
}
