import { randomBytes } from "crypto";
import format from "pg-format";
import { pgOptionsTestDB } from "../database/config";
import wrappedPool from "../database/wrappedPool";
import migrate from "node-pg-migrate";

export default class PGContext {
  roleName: string;
  static async build() {
    const roleName = "a" + randomBytes(4).toString("hex"); // pg requires role names start with a letter
    await wrappedPool.connect(pgOptionsTestDB);
    await wrappedPool.query(format(`CREATE ROLE %I WITH LOGIN PASSWORD %L;`, roleName, roleName));
    await wrappedPool.query(format(`CREATE SCHEMA %I AUTHORIZATION %I;`, roleName, roleName));
    await wrappedPool.close();
    await migrate({
      schema: roleName,
      direction: "up",
      log: () => {},
      noLock: true,
      dir: "migrations",
      databaseUrl: {
        host: "localhost",
        port: 5432,
        database: "lucella-test",
        user: roleName,
        password: roleName,
      },
      migrationsTable: "migrations",
    });
    await wrappedPool.connect({
      host: "localhost",
      port: 5432,
      database: "lucella-test",
      user: roleName,
      password: roleName,
    });
    return new PGContext(roleName);
  }

  async cleanup() {
    await wrappedPool.close();
    await wrappedPool.connect(pgOptionsTestDB);
    await wrappedPool.query(format("DROP SCHEMA %I CASCADE;", this.roleName));
    await wrappedPool.query(format("DROP ROLE %I;", this.roleName));
    await wrappedPool.close();
  }

  constructor(roleName: string) {
    this.roleName = roleName;
  }
}
