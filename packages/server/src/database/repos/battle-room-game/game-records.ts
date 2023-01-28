import format from "pg-format";
import { IBattleRoomGameRecord } from "../../../../../common";
import { PSQL_TABLES } from "../../../consts";
import toCamelCase from "../../../utils/toCamelCase";
import wrappedPool from "../../wrappedPool";

export default class BattleRoomGameRecordRepo {
  static async findOne(field: keyof IBattleRoomGameRecord, value: any): Promise<IBattleRoomGameRecord> {
    const { rows } = await wrappedPool.query(format(`SELECT * FROM ${PSQL_TABLES.BATTLE_ROOM_GAME_RECORDS} WHERE %I = %L;`, field, value));
    return toCamelCase(rows)[0] as unknown as IBattleRoomGameRecord;
  }

  static async findAllByUserId(id: number): Promise<IBattleRoomGameRecord | undefined> {
    const result = await wrappedPool.query(`SELECT * FROM ${PSQL_TABLES.BATTLE_ROOM_GAME_RECORDS} WHERE first_player_id = $1 OR second_player_id = $1;`, [id]);
    if (!result) return undefined;
    const { rows } = result;
    return toCamelCase(rows)[0] as unknown as IBattleRoomGameRecord;
  }

  static async insert(
    firstPlayerId: number,
    firstPlayerScore: number,
    firstPlayerPreGameElo: number,
    firstPlayerPostGameElo: number,
    secondPlayerId: number,
    secondPlayerScore: number,
    secondPlayerPreGameElo: number,
    secondPlayerPostGameElo: number
  ) {
    const { rows } = await wrappedPool.query(
      format(
        `INSERT INTO ${PSQL_TABLES.BATTLE_ROOM_GAME_RECORDS} 
        (
          first_player_id,
          first_player_score,
          first_player_pre_game_elo,
          first_player_post_game_elo,
          second_player_id,
          second_player_score,
          second_player_pre_game_elo,
          second_player_post_game_elo
        )
         VALUES (%L, %L, %L, %L, %L, %L, %L, %L) RETURNING *;`,
        firstPlayerId,
        firstPlayerScore,
        firstPlayerPreGameElo,
        firstPlayerPostGameElo,
        secondPlayerId,
        secondPlayerScore,
        secondPlayerPreGameElo,
        secondPlayerPostGameElo
      )
    );
    return toCamelCase(rows)[0] as unknown as IBattleRoomGameRecord;
  }
}
