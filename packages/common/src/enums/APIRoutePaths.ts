export enum AuthRoutePaths {
  ROOT = "/auth",
  LOGOUT = "/logout",
  REQUEST_PASSWORD_RESET_EMAIL = "/request-password-reset-email",
}

export enum UsersRoutePaths {
  ROOT = "/users",
  PASSWORD = "/password",
  ACCOUNT_ACTIVATION = "/account-activation",
  ACCOUNT_DELETION = "/account-deletion",
  ACCOUNT_BAN = "/account-ban",
}

export enum ModerationRoutePaths {
  ROOT = "/moderation",
  IP_BAN = "/ip-ban",
}

export enum ConfigRoutePaths {
  ROOT = "/config",
  MAX_CONCURRENT_GAMES = "/max-concurrent-games",
  GAME_START_COUNTDOWN = "/game-start-countdown",
}

export enum CypressTestRoutePaths {
  ROOT = "/cypress-tests",
  DROP_ALL_TEST_USERS = "/drop-all-test-users",
  CREATE_SEQUENTIAL_ELO_TEST_USERS = "/create-sequential-elo-test-users",
  CREATE_CYPRESS_TEST_USER = "/create-cypress-test-user",
  RATE_LIMITER = "/rate-limiter",
}

export enum LadderRoutePaths {
  ROOT = "/ladder",
  BATTLE_ROOM = "/battle-room",
  ENTRIES = "/entries",
}
