import bcrypt from "bcryptjs";
import { UserRole } from "../../../../common";
import CustomError from "../../classes/CustomError";
import { REDIS_KEYS } from "../../consts";
import BattleRoomScoreCardRepo from "../../database/repos/battle-room-game/score-cards";
import UserRepo from "../../database/repos/users";
import { wrappedRedis } from "../RedisContext";
import { TEST_USER_PASSWORD } from "./consts";

export default async function createTestUser(
  name: string,
  email: string,
  password?: string,
  role?: UserRole,
  battleRoomElo?: number,
  wins?: number,
  losses?: number
) {
  const hashedPassword = await bcrypt.hash(password || TEST_USER_PASSWORD, 12);
  const user = await UserRepo.insert(name, email, hashedPassword, role);
  if (battleRoomElo) {
    const scoreCard = await BattleRoomScoreCardRepo.insert(user.id);
    const updatedScoreCard = await BattleRoomScoreCardRepo.update({
      ...scoreCard,
      elo: battleRoomElo,
      wins: wins || 0,
      losses: losses || 0,
    });
    const forRedis = [{ value: updatedScoreCard.userId.toString(), score: updatedScoreCard.elo }];
    await wrappedRedis.context?.zAdd(REDIS_KEYS.BATTLE_ROOM_LADDER, forRedis);
  }
  return user;
}
