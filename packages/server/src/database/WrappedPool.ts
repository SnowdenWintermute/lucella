import pg from "pg";

class WrappedPool {
  _pool: pg.Pool | null = null;

  connect(options: pg.PoolConfig) {
    this._pool = new pg.Pool(options);
    return this._pool.query("SELECT 1+1;");
  }

  close() {
    return this._pool?.end();
  }

  query(sql: any, params?: any): any {
    return this._pool?.query(sql, params);
  }
}

export default new WrappedPool();
