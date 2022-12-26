import { nameMaxLength, nameMinLength, passwordMinLength } from "./auth-validation-config";
import { maxGameNameLength, rankedGameChannelNamePrefix } from "./game-lobby-config";

export const ErrorMessages = {
  SERVER_GENERIC: "Internal server error",
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
  },
  AUTH: {
    NOT_LOGGED_IN: "You are not logged in",
    INVALID_OR_EXPIRED_TOKEN: "Invalid or expired token",
    EXPIRED_SESSION: "User session has expired, please log in again",
    INVALID_CREDENTIALS: "Incorrect email or password",
    NO_USER_EXISTS: "The specified user longer exists",
    ROLE_RESTRICTED: "That action is role restricted",
    EMAIL_DOES_NOT_EXIST: "No user with that email exists",
    EMAIL_IN_USE_OR_UNAVAILABLE: "The specified email is already in use or is unavailable",
    PASSWORD_RESET_EMAIL: "Error trying to send password reset email",
    ACCOUNT_BANNED: "The specified account has been banned",
  },
  VALIDATION: {
    AUTH: {
      REQUIRED_FIELD: {
        NAME: "A name is required",
        EMAIL: "An email address is required",
        PASSWORD: "Please enter a password",
        PASSWORD_CONFIRMATION: "Please confirm your password",
      },
      INVALID_EMAIL: "Invalid email",
      PASSWORD_MIN_LENGTH: `Password must be at least ${passwordMinLength} characters`,
      PASSWORD_MAX_LENGTH: `Password must be no longer than ${passwordMinLength} characters`,
      PASSWORDS_DONT_MATCH: "Password confirmation does not match the password",
      NAME_MIN_LENGTH: `Name must be at least ${nameMinLength} characters`,
      NAME_MAX_LENGTH: `Name must be no longer than ${nameMaxLength} characters`,
    },
  },
};
