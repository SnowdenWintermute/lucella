export const pgOptions = {
  host: process.env.NODE_ENV === "production" ? process.env.POSTGRES_CONNECTION_STRING_PRODUCTION : "localhost",
  port: 5432,
  database: process.env.NODE_ENV === "production" ? process.env.POSTGRES_DB_PRODUCTION : process.env.POSTGRES_DB,
  user: process.env.NODE_ENV === "production" ? process.env.POSTGRES_USER_PRODUCTION : process.env.POSTGRES_USER,
  password: process.env.NODE_ENV === "production" ? process.env.POSTGRES_PASSWORD_PRODUCTION : process.env.POSTGRES_PASSWORD,
};

export const pgOptionsTestDB = {
  host: "localhost",
  port: 5432,
  database: "lucella-test",
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};
