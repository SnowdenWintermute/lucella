import signTokenAndCreateSession from "../../controllers/utils/signTokenAndCreateSession";
import UsersRepo from "../../database/repos/users";

export default async function logTestUserIn(email: string) {
  const user = await UsersRepo.findOne("email", email);
  const { accessToken } = await signTokenAndCreateSession(user);
  return { user, accessToken };
}
