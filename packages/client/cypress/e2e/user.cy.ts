import { ErrorMessages, FrontendRoutes, SuccessAlerts } from "../../../common";

it(`Redirects unauthorized user from /settings to /login and lets them sign in, redirecting them to /battle-room.
  Then they can select settings and it brings them to /settings.
  Logging out from settings redirects them to sign in and profile icon changes to login link.
  They can log in again as expected`, () => {
  //
});

// @todo - test token expiration
