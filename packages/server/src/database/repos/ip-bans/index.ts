import format from "pg-format";
import { IPBan, IPBanReason } from "../../../../../common";
import toCamelCase from "../../../utils/toCamelCase";
import wrappedPool from "../../wrappedPool";

export default class IpBanRepo {
  static async findOne(ipAddress: string): Promise<IPBan> {
    const { rows } = await wrappedPool.query(format(`SELECT * FROM banned_ip_addresses WHERE ip_address = %L;`, ipAddress));
    // @ts-ignore
    return toCamelCase(rows)[0] as unknown as IPBan;
  }
  static async findById(id: number): Promise<IPBan | undefined> {
    const result = await wrappedPool.query(`SELECT * FROM banned_ip_addresses WHERE id = $1;`, [id]);
    if (!result) return undefined;
    const { rows } = result;
    // @ts-ignore
    return toCamelCase(rows)[0] as unknown as IPBan;
  }
  static async upsert(ipAddress: string, expiresAt: number, reason: IPBanReason) {
    const { rows } = await wrappedPool.query(
      format(
        `INSERT INTO banned_ip_addresses (ip_address, expires_at, reason) VALUES (%L, %L, %L)
        ON CONFLICT (ip_address) DO UPDATE
        SET expires_at = %2$L, reason = %3$L RETURNING *;`,
        ipAddress.trim(),
        expiresAt ? new Date(expiresAt).toISOString() : null,
        reason
      )
    );
    return toCamelCase(rows)[0] as unknown as IPBan;
  }

  static async delete(ipAddress: string) {
    const { rows } = await wrappedPool.query(`DELETE FROM banned_ip_addresses WHERE  ip_address = $1 RETURNING *;`, [ipAddress]);
    return toCamelCase(rows)![0] as unknown as IPBan;
  }

  static async deleteAll() {
    await wrappedPool.query(`DELETE FROM banned_ip_addresses;`);
  }

  static async count() {
    const { rows } = await wrappedPool.query("SELECT COUNT(*) FROM banned_ip_addresses;");
    return parseInt(rows[0].count, 10);
  }
}
