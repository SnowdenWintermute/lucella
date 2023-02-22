import format from "pg-format";
import { PSQL_TABLES } from "../../../consts";
import { TEST_USER_NAME, TEST_USER_NAME_ALTERNATE } from "../../../utils/test-utils/consts";
import toCamelCase from "../../../utils/toCamelCase";
import wrappedPool from "../../wrappedPool";

export default class CypressTestRepo {
  static async deleteTestUserGameRecords() {
    const firstTestUserQueryResult = await wrappedPool.query(format(`SELECT * FROM ${PSQL_TABLES.USERS} WHERE name = %L;`, TEST_USER_NAME));
    const firstTestUser = toCamelCase(firstTestUserQueryResult.rows)[0];
    const secondTestUserQueryResult = await wrappedPool.query(format(`SELECT * FROM ${PSQL_TABLES.USERS} WHERE name = %L;`, TEST_USER_NAME_ALTERNATE));
    const secondTestUser = toCamelCase(secondTestUserQueryResult.rows)[0];
    await wrappedPool.query(
      format(`DELETE FROM ${PSQL_TABLES.BATTLE_ROOM_GAME_RECORDS} WHERE first_player_id = %L OR first_player_id = %L;`, firstTestUser?.id, secondTestUser?.id)
    );
  }
  static async deleteTestUsers() {
    // if (process.env.NODE_ENV !== "development") return
    await wrappedPool.query(`DELETE FROM ${PSQL_TABLES.USERS} WHERE name = $1 OR name = $2;`, [
      TEST_USER_NAME.toLowerCase().trim(),
      TEST_USER_NAME_ALTERNATE.toLowerCase().trim(),
    ]);
    await wrappedPool.query(`DELETE FROM users WHERE email LIKE '%test%';`);
  }
}
