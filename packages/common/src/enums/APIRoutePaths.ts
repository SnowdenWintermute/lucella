export enum AuthRoutePaths {
  ROOT = "/auth",
  LOGOUT = "/logout",
  REQUEST_PASSWORD_RESET_EMAIL = "/request-password-reset-email",
}

export enum UsersRoutePaths {
  ROOT = "/users",
  PASSWORD = "/password",
  ACCOUNT_ACTIVATION = "/account-activation",
  DROP_ALL_TEST_USERS = "/drop-all-test-users",
  CREATE_CYPRESS_TEST_USER = "/create-cypress-test-user",
  ACCOUNT_DELETION = "/account-deletion",
}
