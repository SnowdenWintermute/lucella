import format from "pg-format";
import { BattleRoomGameConfigOptionIndices, BattleRoomGameConfigOptionIndicesUpdate, IBattleRoomConfigSettings } from "../../../../../common";
import { PSQL_TABLES } from "../../../consts";
import toCamelCase from "../../../utils/toCamelCase";
import wrappedPool from "../../wrappedPool";

export default class BattleRoomGameSettingsRepo {
  static async findByUserId(id: number): Promise<IBattleRoomConfigSettings | undefined> {
    const result = await wrappedPool.query(`SELECT * FROM ${PSQL_TABLES.BATTLE_ROOM_GAME_CONFIGS} WHERE user_id = $1;`, [id]);
    if (!result) return undefined;
    const { rows } = result;
    return toCamelCase(rows)[0] as unknown as IBattleRoomConfigSettings;
  }

  static async insert(userId: number, options: BattleRoomGameConfigOptionIndices) {
    const { acceleration, topSpeed, hardBrakingSpeed, turningSpeedModifier, speedIncrementRate, numberOfRoundsRequiredToWin } = options;

    const { rows } = await wrappedPool.query(
      format(
        `INSERT INTO ${PSQL_TABLES.BATTLE_ROOM_GAME_CONFIGS}
        (user_id, acceleration_option_index, top_speed_option_index, turning_speed_modifier_option_index, 
        hard_braking_speed_option_index, speed_increment_rate_option_index, number_of_rounds_required_to_win_option_index) 
        VALUES (%L, %L, %L, %L, %L, %L,) RETURNING *;`,
        userId,
        acceleration,
        topSpeed,
        hardBrakingSpeed,
        turningSpeedModifier,
        speedIncrementRate,
        numberOfRoundsRequiredToWin
      )
    );
    return toCamelCase(rows)[0] as unknown as IBattleRoomConfigSettings;
  }

  static async update(userId: number, options: BattleRoomGameConfigOptionIndicesUpdate) {
    if (!(options instanceof BattleRoomGameConfigOptionIndices)) return undefined;
    const fieldNames = Object.keys(options)
      .map((fieldName) => format("%I", fieldName))
      .join(", ");
    const fieldValues = Object.values(options).map((fieldValue) => format("%L", fieldValue));
    const queryText = format(`UPDATE %I SET (${fieldNames}) = (%L) WHERE user_id = %L`, PSQL_TABLES.BATTLE_ROOM_GAME_CONFIGS, fieldValues, userId);
    const { rows } = await wrappedPool.query(format(queryText));
    return toCamelCase(rows)![0] as unknown as IBattleRoomConfigSettings;
  }
}
