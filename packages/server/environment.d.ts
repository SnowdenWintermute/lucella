declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EMAIL_PASSWORD: string;
      SENDGRID_API_KEY: string;
      DATABASE_URL: string;

      NODE_ENV: string;
      EMAIL_ROOT_URL: string;
      EMAIL_ROOT_URL_DEV: string;
      PORT: number;
      ORIGIN: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_DB: string;

      REDIS_URL: string;

      ACCESS_TOKEN_EXPIRES_IN: number;
      AUTH_SESSION_EXPIRATION: number;
      PASSWORD_RESET_TOKEN_EXPIRES_IN: number;
      ACCOUNT_ACTIVATION_SESSION_EXPIRATION: number;

      TESTER_KEY: string;
      CYPRESS_TEST_USER_NAME: string;

      ACCESS_TOKEN_PRIVATE_KEY: string;
      ACCESS_TOKEN_PUBLIC_KEY: string;

      REFRESH_TOKEN_PRIVATE_KEY: string;
      REFRESH_TOKEN_PUBLIC_KEY: string;

      PASSWORD_RESET_TOKEN_PRIVATE_KEY: string;
      PASSWORD_RESET_TOKEN_PUBLIC_KEY: string;
      ACCOUNT_ACTIVATION_TOKEN_PRIVATE_KEY: string;
      ACCOUNT_ACTIVATION_TOKEN_PUBLIC_KEY: string;
    }
  }
}

export {};
