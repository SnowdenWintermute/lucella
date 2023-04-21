import format from "pg-format";
import { IBattleRoomConfigSettings } from "../../../../../common";
import { PSQL_TABLES } from "../../../consts";
import toCamelCase from "../../../utils/toCamelCase";
import wrappedPool from "../../wrappedPool";

export default class BattleRoomGameConfigRepo {
  static async findByUserId(id: number): Promise<IBattleRoomConfigSettings | undefined> {
    const result = await wrappedPool.query(`SELECT * FROM ${PSQL_TABLES.BATTLE_ROOM_GAME_CONFIGS} WHERE user_id = $1;`, [id]);
    if (!result) return undefined;
    const { rows } = result;
    return toCamelCase(rows)[0] as unknown as IBattleRoomConfigSettings;
  }

  static async insert(battleRoomGameConfig: IBattleRoomConfigSettings) {
    const { acceleration, topSpeed, turningSpeedModifier, hardBrakingSpeed, speedIncrementRate, userId } = battleRoomGameConfig;

    const { rows } = await wrappedPool.query(
      format(
        `INSERT INTO ${PSQL_TABLES.BATTLE_ROOM_GAME_CONFIGS}
        (user_id, acceleration, top_speed, turning_speed_modifier, hard_braking_speed, speed_increment_rate) 
        VALUES (%L, %L, %L, %L, %L, %L,) RETURNING *;`,
        userId,
        acceleration,
        topSpeed,
        turningSpeedModifier,
        hardBrakingSpeed,
        speedIncrementRate
      )
    );
    return toCamelCase(rows)[0] as unknown as IBattleRoomConfigSettings;
  }

  static async update(battleRoomGameConfig: IBattleRoomConfigSettings) {
    const { acceleration, topSpeed, turningSpeedModifier, hardBrakingSpeed, speedIncrementRate, userId } = battleRoomGameConfig;
    const { rows } = await wrappedPool.query(
      format(
        `UPDATE ${PSQL_TABLES.BATTLE_ROOM_GAME_CONFIGS} SET elo = %L, wins = %L, losses = %L, draws = %L WHERE user_id = %L RETURNING *;`,
        acceleration,
        topSpeed,
        turningSpeedModifier,
        hardBrakingSpeed,
        speedIncrementRate,
        userId
      )
    );
    return toCamelCase(rows)![0] as unknown as IBattleRoomConfigSettings;
  }
}
