import { Ban, User, UserStatuses } from "../../../../common";
import UsersRepo from "../../database/repos/users";
import { lucella } from "../../lucella";
import { wrappedRedis } from "../../utils/RedisContext";

export default async function banUser(user: User, ban: Ban) {
  user.status = UserStatuses.BANNED;
  if (ban.duration) user.banExpiresAt = Date.now() + ban.duration;
  else user.banExpiresAt = null;
  await UsersRepo.update(user);
  wrappedRedis.context!.del(user.id.toString());
  lucella.server?.disconnectUser(user.name);
}
