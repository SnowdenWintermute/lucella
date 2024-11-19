import { env } from "../validate-env";

export const pgOptions = {
  host: env.NODE_ENV === "production" ? env.POSTGRES_HOST_PRODUCTION : env.POSTGRES_HOST_DEV,
  port: 5432,
  database: env.NODE_ENV === "production" ? env.POSTGRES_DB_PRODUCTION : env.POSTGRES_DB,
  user: env.NODE_ENV === "production" ? env.POSTGRES_USER_PRODUCTION : env.POSTGRES_USER,
  password: env.NODE_ENV === "production" ? env.POSTGRES_PASSWORD_PRODUCTION : env.POSTGRES_PASSWORD,
};

export const pgOptionsTestDB = {
  host: "localhost",
  port: 5432,
  database: "lucella-test",
  user: env.POSTGRES_USER,
  password: env.POSTGRES_PASSWORD,
};
