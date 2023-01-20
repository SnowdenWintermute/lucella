import format from "pg-format";
import { User, UserRole } from "../../../../../common";
import { TEST_USER_NAME, TEST_USER_NAME_ALTERNATE } from "../../../utils/test-utils/consts";
import toCamelCase from "../../../utils/toCamelCase";
import wrappedPool from "../../wrappedPool";

export default class UserRepo {
  // static async find() {
  //   const { rows } = await wrappedPool.query(`SELECT * FROM users ORDER BY id;`);
  //   return toCamelCase(rows) as unknown as User;
  // }
  static async findOne(field: keyof User, value: any): Promise<User> {
    const { rows } = await wrappedPool.query(format(`SELECT * FROM users WHERE %I = %L;`, field, value));
    // @ts-ignore
    return toCamelCase(rows)[0] as unknown as User;
  }
  static async findById(id: number): Promise<User | undefined> {
    const result = await wrappedPool.query(`SELECT * FROM users WHERE id = $1;`, [id]);
    if (!result) return undefined;
    const { rows } = result;
    // @ts-ignore
    return toCamelCase(rows)[0] as unknown as User;
  }
  static async insert(name: string, email: string, password: string, role?: UserRole) {
    const { rows } = await wrappedPool.query(
      format(
        `INSERT INTO users (name, email, password, role) VALUES (%L, %L, %L, %L) RETURNING *;`,
        name.toLowerCase().trim(),
        email.toLowerCase(),
        password,
        role || UserRole.USER
      )
    );
    return toCamelCase(rows)[0] as unknown as User;
  }
  static async update(user: User) {
    const { id, name, email, password, status, role, banExpiresAt } = user;
    const { rows } = await wrappedPool.query(
      format(
        `UPDATE users SET name = %L, email = %L, password = %L, status = %L, role = %L, ban_expires_at = %L WHERE id = %L RETURNING *;`,
        name.toLowerCase().trim(),
        email.toLowerCase(),
        password,
        status,
        role,
        banExpiresAt ? new Date(banExpiresAt).toISOString() : null,
        id
      )
    );
    return toCamelCase(rows)![0] as unknown as User;
  }
  static async delete(id: number) {
    const { rows } = await wrappedPool.query(`DELETE FROM  users  WHERE  id = $1 RETURNING *;`, [id]);
    return toCamelCase(rows)![0] as unknown as User;
  }
  static async deleteTestUsers() {
    if (process.env.NODE_ENV === "development")
      await wrappedPool.query(`DELETE FROM users WHERE name = $1 OR name = $2;`, [
        TEST_USER_NAME.toLowerCase().trim(),
        TEST_USER_NAME_ALTERNATE.toLowerCase().trim(),
      ]);
    else {
      console.log("can't drop all userse unless in development mode");
      throw new Error("can't drop users unless in development mode");
    }
  }
  static async count() {
    const { rows } = await wrappedPool.query("SELECT COUNT(*) FROM users;");
    return parseInt(rows[0].count, 10);
  }
}
