import format from "pg-format";
import { User } from "../../../../../common";
import toCamelCase from "../../../utils/toCamelCase";
import wrappedPool from "../../wrappedPool";

export default class UserRepo {
  static async find() {
    const { rows } = await wrappedPool.query(`SELECT * FROM users ORDER BY id;`);
    return toCamelCase(rows) as unknown as User;
  }
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
  static async insert(name: string, email: string, password: string) {
    const { rows } = await wrappedPool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;", [name, email, password]);
    return toCamelCase(rows)[0] as unknown as User;
  }
  static async update(user: User) {
    const { id, name, email, password, status, role } = user;
    const { rows } = await wrappedPool.query(
      format(
        `UPDATE users SET name = %L, email = %L, password = %L, status = %L, role = %L WHERE id = %L RETURNING *;`,
        name,
        email,
        password,
        status,
        role,
        id
      )
    );
    return toCamelCase(rows)![0] as unknown as User;
  }
  static async delete(id: number) {
    const { rows } = await wrappedPool.query(`DELETE FROM  users  WHERE  id = $1 RETURNING *`, [id]);
    return toCamelCase(rows)![0] as unknown as User;
  }
  static async count() {
    const { rows } = await wrappedPool.query("SELECT COUNT(*) FROM users;");
    return parseInt(rows[0].count, 10);
  }
}
