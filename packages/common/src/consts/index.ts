// basics
export const websiteName = "melphina.com";
export const SOCKET_ADDRESS_PRODUCTION = "http://localhost:8080";
export const SERVER_HOSTNAME_DOCKER_PRODUCTION = "http://localhost:8080/api";
export const REDIS_HOSTNAME_PRODUCTION = "redis";
// times
export const ONE_SECOND = 1000;
export const ONE_MINUTE = ONE_SECOND * 60;
export const ONE_HOUR = ONE_MINUTE * 60;
export const ONE_DAY = ONE_HOUR * 24;
// rate limits
// client socket chat
export const chatDelayUnregisteredUser = ONE_SECOND * 3;
export const chatDelayLoggedInUser = 300;
// ip:general
export const perIpSlidingWindowTime = 30 * ONE_MINUTE;
export const perIpSlidingWindowLimit = 500;
export const perIpFixedWindowCounterTime = 30 * ONE_SECOND;
export const perIpFixedWindowCounterLimit = 50;
// ip: registration
export const registrationSlidingWindowLimit = 5;
export const registrationFixedWindowCounterTime = 10 * ONE_SECOND;
export const registrationFixedWindowCounterLimit = 2;
// ip: password reset email
export const passwordResetEmailSlidingWindowLimit = 3;
export const passwordResetEmailFixedWindowCounterTime = 10 * ONE_SECOND;
export const passwordResetEmailFixedWindowCounterLimit = 1;
// login
export const failedLoginCounterExpiration = 10 * ONE_MINUTE;
export const failedLoginCountTolerance = 3;
// redis key prefixes
export const REDIS_KEY_PREFIXES = {
  FAILED_LOGINS: "_failed_login_attempts",
};
// cookies
export const CookieNames = {
  ACCESS_TOKEN: "access_token",
};
// battle-room game
export const ghostTransparency = 0.3;
export const inGameFontSizes = { medium: 12, large: 25 };
export const colors = {
  hostEndZone: "rgb(50,50,70)",
  challengerEndZone: "rgb(50,70,50)",
  inGameTextLight: "rgb(200,200,200)",
  hostOrbs: "13, 28, 46",
  challengerOrbs: "0, 75, 79",
  selectionRingColor: "rgb(30,200,30)",
};
export const renderRate = 33;
export const physicsTickRate = 50;
export const eventLimiterRate = renderRate;
export const minimumSelectionBoxSize = 3;
export const touchHoldSelectionBoxStartThreshold = 500;
export const minimumQuickTouchSelectionBoxSize = 8;
export const startingLadderRating = 1500;
export const reconciliationThreshold = 10;
export const simulateLag = true;
export const simulatedLagMs = 100;
export const desyncTolerance = 5;
export const endScreenCountdownDelay = 1010;

// Matter-JS
export const hostOrbCollisionCategory = 0x0001;
export const challengerOrbCollisionCategory = 0x0002;

// anti cheat
export const movementRequestAntiCheatGracePeriod = 50;
export const movementRequestRateMarginOfError = 3;
// the value below is used for the first movement request since there is no previous request to calculate the time difference
// when calculating the average time between requests it would otherwise be such a large number the average would be ruined
export const firstMovementRequestTimeLimiter = 200;
