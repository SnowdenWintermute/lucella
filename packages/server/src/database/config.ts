import { POSTGRES_HOSTNAME_PRODUCTION } from "../../../common";

export const pgOptions = {
  host: process.env.NODE_ENV === "production" ? POSTGRES_HOSTNAME_PRODUCTION : "localhost",
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

export const pgOptionsTestDB = {
  host: "localhost",
  port: 5432,
  database: "lucella-test",
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};
