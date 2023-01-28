import signTokenAndCreateSession from "../../controllers/utils/signTokenAndCreateSession";
import UserRepo from "../../database/repos/users";

export default async function logTestUserIn(email: string) {
  const user = await UserRepo.findOne("email", email);
  const { accessToken } = await signTokenAndCreateSession(user);
  return { user, accessToken };
}
