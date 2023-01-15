import { ONE_DAY } from "./index";

export const SuccessAlerts = {
  USERS: {
    ACCOUNT_CREATED: "Account created",
    ACCOUNT_DELETED: "Account deleted",
  },
  AUTH: {
    ACCOUNT_ACTIVATION_EMAIL_SENT: "An email has been sent with a link to activate your account",
    CHANGE_PASSWORD_EMAIL_SENT: "An email has been sent with a link to change your password",
    PASSWORD_CHANGED: "Password changed",
    LOGIN: "Welcome back",
  },
  ADMIN: {
    USER_BANNED: (username: string, duration: number | null) => `User ${username} banned for ${duration ? `${duration / ONE_DAY} days` : `indefinitely`}`,
  },
};
