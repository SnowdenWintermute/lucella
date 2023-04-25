import { BattleRoomGameConfigOptionIndices, IBattleRoomConfigSettings } from "../../../../../common";
import { PSQL_TABLES } from "../../../consts";
import toCamelCase from "../../../utils/toCamelCase";
import wrappedPool from "../../wrappedPool";

export default class BattleRoomGameSettingsRepo {
  static async findByUserId(id: number): Promise<IBattleRoomConfigSettings | undefined> {
    const result = await wrappedPool.query(`SELECT * FROM ${PSQL_TABLES.BATTLE_ROOM_GAME_CONFIGS} WHERE user_id = $1;`, [id]);
    const { rows } = result;
    if (!rows.length) return undefined;
    return toCamelCase(rows)[0] as unknown as IBattleRoomConfigSettings;
  }

  static async insert(userId: number, options: BattleRoomGameConfigOptionIndices) {
    const {
      acceleration,
      topSpeed,
      hardBrakingSpeed,
      turningSpeedModifier,
      speedIncrementRate,
      numberOfRoundsRequiredToWin,
      numberOfPointsRequiredToWinRound,
      orbRadius,
    } = options;

    const { rows } = await wrappedPool.query(
      `INSERT INTO ${PSQL_TABLES.BATTLE_ROOM_GAME_CONFIGS}
        (user_id, acceleration, top_speed, turning_speed_modifier, 
        hard_braking_speed, speed_increment_rate, number_of_rounds_required_to_win, number_of_points_required_to_win_round, 
        orb_radius) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
      [
        userId,
        acceleration,
        topSpeed,
        turningSpeedModifier,
        hardBrakingSpeed,
        speedIncrementRate,
        numberOfRoundsRequiredToWin,
        numberOfPointsRequiredToWinRound,
        orbRadius,
      ]
    );
    return toCamelCase(rows)[0] as unknown as IBattleRoomConfigSettings;
  }

  static async update(userId: number, options: BattleRoomGameConfigOptionIndices) {
    const {
      acceleration,
      topSpeed,
      hardBrakingSpeed,
      turningSpeedModifier,
      speedIncrementRate,
      numberOfRoundsRequiredToWin,
      numberOfPointsRequiredToWinRound,
      orbRadius,
    } = options;
    const { rows } = await wrappedPool.query(
      `UPDATE ${PSQL_TABLES.BATTLE_ROOM_GAME_CONFIGS}
    SET user_id = $1, acceleration = $2, top_speed = $3, turning_speed_modifier = $4, 
    hard_braking_speed = $5, speed_increment_rate = $6, number_of_rounds_required_to_win = $7, number_of_points_required_to_win_round = $8, orb_radius = $9
    RETURNING *;`,
      [
        userId,
        acceleration,
        topSpeed,
        turningSpeedModifier,
        hardBrakingSpeed,
        speedIncrementRate,
        numberOfRoundsRequiredToWin,
        numberOfPointsRequiredToWinRound,
        orbRadius,
      ]
    );
    return toCamelCase(rows)![0] as unknown as IBattleRoomConfigSettings;
  }
}
