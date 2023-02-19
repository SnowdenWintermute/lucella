import createRandomUserData from "./createRandomUserData";
import createTestUser from "./createTestUser";

export default function createRandomTestUsers(numberOfUsersToCreate: number) {
  for (let i = numberOfUsersToCreate; i > 0; i -= 1) {
    const { name, email, password, elo, wins, losses } = createRandomUserData();
    createTestUser(name, email, password, undefined, elo, wins, losses);
  }
}
