import format from "pg-format";
import { BattleRoomLadderEntry, BattleRoomLadderEntryWithUserId, IBattleRoomScoreCard } from "../../../../../common";
import { PSQL_TABLES } from "../../../consts";
import toCamelCase from "../../../utils/toCamelCase";
import wrappedPool from "../../wrappedPool";

export default class BattleRoomScoreCardRepo {
  static async count() {
    const { rows } = await wrappedPool.query(`SELECT COUNT(*) FROM ${PSQL_TABLES.BATTLE_ROOM_SCORE_CARDS};`);
    return parseInt(rows[0].count, 10);
  }
  static async findOne(field: keyof IBattleRoomScoreCard, value: any): Promise<IBattleRoomScoreCard | undefined> {
    const { rows } = await wrappedPool.query(format(`SELECT * FROM ${PSQL_TABLES.BATTLE_ROOM_SCORE_CARDS} WHERE %I = %L;`, field, value));
    if (!rows) return undefined;
    return toCamelCase(rows)[0] as unknown as IBattleRoomScoreCard;
  }
  static async findByUserId(id: number): Promise<IBattleRoomScoreCard | undefined> {
    const result = await wrappedPool.query(`SELECT * FROM ${PSQL_TABLES.BATTLE_ROOM_SCORE_CARDS} WHERE user_id = $1;`, [id]);
    if (!result) return undefined;
    const { rows } = result;
    return toCamelCase(rows)[0] as unknown as IBattleRoomScoreCard;
  }
  static async getEloAndUserIdByPage(pageSize: number, pageNumber: number): Promise<{ userId: number; elo: number }[] | undefined> {
    const fields = ["user_id", "elo"];
    const result = await wrappedPool.query(
      `SELECT ${fields.join(",")} FROM ${PSQL_TABLES.BATTLE_ROOM_SCORE_CARDS} LIMIT ${pageSize} OFFSET ${pageSize * pageNumber};`
    );
    if (!result) return undefined;
    const { rows } = result;
    return toCamelCase(rows) as unknown as { userId: number; elo: number }[];
  }
  static async getScoreCardsWithUsernameByUserIds(ids: number[]): Promise<BattleRoomLadderEntry[] | undefined> {
    // there should not be sql injection here because we get the ids from the redis ladder sorted set
    const fields = ["name", "elo", "wins", "losses"];
    const result = await wrappedPool.query(
      `SELECT ${fields.join(",")} FROM ${PSQL_TABLES.BATTLE_ROOM_SCORE_CARDS}
      JOIN ${PSQL_TABLES.USERS} ON user_id = users.id
      WHERE user_id IN (${ids.join(",")});`
    );
    if (!result) return undefined;
    const { rows } = result;
    return toCamelCase(rows) as unknown as BattleRoomLadderEntry[];
  }
  static async getLadderEntryUsername(username: string): Promise<BattleRoomLadderEntryWithUserId | undefined> {
    const fields = ["name", "elo", "wins", "losses", "user_id"];
    const result = await wrappedPool.query(
      format(
        `SELECT ${fields.join(",")} FROM ${PSQL_TABLES.BATTLE_ROOM_SCORE_CARDS}
      JOIN ${PSQL_TABLES.USERS} ON user_id = users.id
      WHERE users.name = %L;`,
        username
      )
    );
    if (!result) return undefined;
    const { rows } = result;
    return toCamelCase(rows)[0] as unknown as BattleRoomLadderEntryWithUserId;
  }
  static async insert(userId: number) {
    const { rows } = await wrappedPool.query(format(`INSERT INTO ${PSQL_TABLES.BATTLE_ROOM_SCORE_CARDS} (user_id) VALUES (%L) RETURNING *;`, userId));
    return toCamelCase(rows)[0] as unknown as IBattleRoomScoreCard;
  }
  static async update(battleRoomScoreCard: IBattleRoomScoreCard) {
    const { elo, wins, losses, draws, userId } = battleRoomScoreCard;
    const { rows } = await wrappedPool.query(
      format(
        `UPDATE ${PSQL_TABLES.BATTLE_ROOM_SCORE_CARDS} SET elo = %L, wins = %L, losses = %L, draws = %L WHERE user_id = %L RETURNING *;`,
        elo,
        wins,
        losses,
        draws,
        userId
      )
    );
    return toCamelCase(rows)![0] as unknown as IBattleRoomScoreCard;
  }
}
