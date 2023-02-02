/* eslint-disable import/first */
// eslint-disable-next-line import/newline-after-import
import * as dotenv from "dotenv";
dotenv.config();
import { DatabaseError } from "pg";
import { Latency } from "toxiproxy-node-client";
import { LucellaServer } from "./classes/LucellaServer";
import { pgOptions } from "./database/config";
import createExpressApp from "./createExpressApp";
import wrappedPool from "./database/wrappedPool";
import { wrappedRedis, RedisContext } from "./utils/RedisContext";
import { lucella } from "./lucella";
import { getToxic } from "./toxiproxy";

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
      // getToxic("latency", <Latency>{ latency: 400, jitter: 100, toxicity: 1, stream: "downstream" })
      //   .then((toxic) => console.log(toxic.toJson()))
      //   .catch(console.error);
    });
  })
  .catch((error: DatabaseError) => console.error(error));
