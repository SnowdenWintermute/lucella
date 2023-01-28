import format from "pg-format";
import { IBattleRoomScoreCard } from "../../../../../common";
import { PSQL_TABLES } from "../../../consts";
import toCamelCase from "../../../utils/toCamelCase";
import wrappedPool from "../../wrappedPool";

export default class BattleRoomScoreCardRepo {
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
