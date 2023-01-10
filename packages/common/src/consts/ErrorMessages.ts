import { nameMaxLength, nameMinLength, passwordMaxLength, passwordMinLength } from "./auth-validation-config";
import { gameChannelNamePrefix, maxGameNameLength, rankedGameChannelNamePrefix } from "./game-lobby-config";

export const ErrorMessages = {
  SERVER_GENERIC: "Internal server error",
  LOBBY: {
    SOCKET_NOT_REGISTERED: "Socket not registered. Server likely restarted, please refresh",
    GAME_EXISTS: "A game by that name already exists",
    GAME_DOES_NOT_EXIST: "No game by that name exists",
    CANT_LEAVE_GAME_THAT_DOES_NOT_EXIST: "Trying to leave a game that doesn't exist",
    CANT_LEAVE_GAME_IF_YOU_ARE_NOT_IN_ONE: "You can't leave a game if you are not in one",
    GAME_IS_FULL: "That game is currently full",
    CANT_PLAY_AGAINST_SELF: "You can not join a game hosted by yourself",
    CANT_HOST_IF_ALREADY_IN_GAME: "You can't host a game if you are already one",
    CANT_JOIN_IF_ALREADY_IN_GAME: "You can't join a game if you are already one",
    LOG_IN_TO_PLAY_RANKED: "Log in or create an account to play ranked games",
    CANT_JOIN_RANKED_GAME_IF_NOT_ASSIGNED: "You can't join a ranked game that the matchmaking didn't assign you to",
    GAME_NAME: {
      NOT_ENTERED: "Please enter a game name",
      MIN_LENGTH: "Game name must be at least one character long",
      MAX_LENGTH: `Game name must be fewer than ${maxGameNameLength} characters`,
      UNAUTHORIZED_RANKED: `Game name can only start with "${rankedGameChannelNamePrefix}" if it is a ranked game`,
      UNAUTHORIZED_CHANNEL_NAME: `Channels prefixed with "${gameChannelNamePrefix}" or "${rankedGameChannelNamePrefix}" are reserved for that game's players`,
    },
  },
  LADDER: {
    USER_NOT_FOUND: "User not found (please note that names are case sensitive)",
  },
  RATE_LIMITER: {
    REQUESTING_TOO_QUICKLY: "You are sending requests too quickly, please wait a while before trying again",
    TOO_MANY_REQUESTS: "You have sent too many requests recently, please wait a while before trying again",
    TOO_MANY_FAILED_LOGINS: "You have failed too many login attempts and your account has been locked, please reset your password to regain access",
  },
  AUTH: {
    NOT_LOGGED_IN: "You are not logged in",
    INVALID_OR_EXPIRED_TOKEN: "Invalid or expired token",
    EXPIRED_SESSION: "User session has expired, please log in again",
    USED_OR_EXPIRED_ACCOUNT_CREATION_SESSION:
      "Either you have already created an account with this token or it has been too long since you initiated account creation, please try registering again to get a new account activation email",
    INVALID_CREDENTIALS: "Incorrect email or password",
    INVALID_CREDENTIALS_WITH_ATTEMPTS_REMAINING: (remaining: number) => {
      if (remaining === 1) return `Incorrect email or password, this is your final attempt before account will be locked`;
      return `Incorrect email or password, you have ${remaining} attempts remaining`;
    },
    NO_USER_EXISTS: "The specified user longer exists",
    ROLE_RESTRICTED: "That action is role restricted",
    EMAIL_DOES_NOT_EXIST: "No user with that email exists",
    EMAIL_IN_USE_OR_UNAVAILABLE: "The specified email is already in use or is unavailable",
    NAME_IN_USE_OR_UNAVAILABLE: "The specified name is already in use or is unavailable",
    CHANGE_PASSWORD_EMAIL: "Error trying to send password reset email",
    CHANGE_PASSWORD_TOKEN: "No token provided - use the link in your email to get a page with a token",
    ACCOUNT_BANNED: "The specified account has been banned",
    PASSWORD_RESET_EMAIL_DOES_NOT_MATCH_TOKEN: "The provided email address did not match with the password reset token",
    ACCOUNT_LOCKED: "Your account has been locked for security reasons, please reset your password to regain access",
  },
  USER: {
    ACCOUNT_DELETION: "An error occurred when trying to delete your account",
  },
  VALIDATION: {
    AUTH: {
      REQUIRED_FIELD: {
        NAME: "A name is required",
        EMAIL: "An email address is required",
        PASSWORD: "Please enter a password",
        PASSWORD_CONFIRMATION: "Please confirm your password",
      },
      CONFIRM_DELETE_ACCOUNT_EMAIL_MATCH: "Email address typed did not match your account's email",
      INVALID_EMAIL: "Invalid email",
      PASSWORD_MIN_LENGTH: `Password must be at least ${passwordMinLength} characters`,
      PASSWORD_MAX_LENGTH: `Password must be no longer than ${passwordMaxLength} characters`,
      PASSWORDS_DONT_MATCH: "Password confirmation does not match the password",
      NAME_MIN_LENGTH: `Name must be at least ${nameMinLength} characters`,
      NAME_MAX_LENGTH: `Name must be no longer than ${nameMaxLength} characters`,
    },
  },
};
