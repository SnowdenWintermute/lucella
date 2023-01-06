// basics
export const websiteName = "melphina.com";
// cookies
export const CookieNames = {
  ACCESS_TOKEN: "access_token",
};
// times
export const ONE_SECOND = 1000;
export const ONE_MINUTE = 60000;
// battle-room game
export const ghostTransparency = 0.3;
export const inGameFontSizes = { medium: 12, large: 25 };
export const colors = {
  hostEndZone: "rgb(50,50,70)",
  challengerEndZone: "rgb(50,70,50)",
  inGameTextLight: "rgb(200,200,200)",
  hostOrbs: "0, 153, 0",
  challengerOrbs: "89,0,179",
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
