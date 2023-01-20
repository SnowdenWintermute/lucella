/* eslint-disable import/first */
// eslint-disable-next-line import/newline-after-import
import * as dotenv from "dotenv";
dotenv.config();
import { DatabaseError } from "pg";
import { LucellaServer } from "./classes/LucellaServer";
import { pgOptions } from "./database/config";
import createExpressApp from "./createExpressApp";
import wrappedPool from "./database/wrappedPool";
import { wrappedRedis, RedisContext } from "./utils/RedisContext";
import { lucella } from "./lucella";

const { PORT } = process.env;

wrappedPool
  .connect(pgOptions)
  .then(() => {
    const app = createExpressApp();
    const listening = app.listen(PORT, async () => {
      wrappedRedis.context = RedisContext.build();
      await wrappedRedis.context.connect();
      console.log(`express server on port ${PORT}`);
      lucella.server = new LucellaServer(listening);
    });
  })
  .catch((error: DatabaseError) => console.error(error));
