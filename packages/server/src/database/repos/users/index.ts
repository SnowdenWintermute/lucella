import { User } from "../../../models/User";
import toCamelCase from "../../../utils/toCamelCase";
import wrappedPool from "../../wrappedPool";
import format from "pg-format";

export default class UserRepo {
  static async find() {
    const { rows } = await wrappedPool.query(`SELECT * FROM users ORDER BY id;`);
    return toCamelCase(rows);
  }
  static async findOne(field: string, value: any): Promise<User> {
    const { rows } = await wrappedPool.query(format(`SELECT * FROM users WHERE %I = %L;`, field, value));
    //@ts-ignore
    return toCamelCase(rows)[0];
  }
  static async findById(id: number): Promise<User | undefined> {
    const { rows } = await wrappedPool.query(`SELECT * FROM users WHERE id = $1;`, [id]);
    //@ts-ignore
    return toCamelCase(rows)[0];
  }
  static async insert(name: string, email: string, password: string) {
    const { rows } = await wrappedPool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;", [name, email, password]);
    return toCamelCase(rows)[0];
  }
  static async update(user: User) {
    const { id, name, email, password } = user;
    const { rows } = await wrappedPool.query(`UPDATE users SET name = $2, email = $3, password = $4, WHERE id = $1 RETURNING *;`, [id, name, email, password]);
    return toCamelCase(rows)![0];
  }
  static async delete(id: number) {
    const { rows } = await wrappedPool.query(`DELETE FROM  users  WHERE  id = $1 RETURNING *`, [id]);
    return toCamelCase(rows)![0];
  }
  static async count() {
    const { rows } = await wrappedPool.query("SELECT COUNT(*) FROM users;");
    return parseInt(rows[0].count);
  }
}
