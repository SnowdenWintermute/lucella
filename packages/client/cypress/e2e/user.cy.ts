import { ErrorMessages, SuccessAlerts } from "../../../common";

it(`Redirects unauthorized user from /settings to /login and lets them sign in, redirecting them to /battle-room.
  Then they can select settings and it brings them to /settings.
  Logging out from settings redirects them to sign in and profile icon changes to login link.
  They can log in again as expected`, () => {
  cy.visit("/settings");
  cy.url().should("be.equal", `${Cypress.env("BASE_URL")}/login`);
  cy.findByRole("heading", { name: /sign in/i }).should("exist");
  cy.findByLabelText(/email/).type(Cypress.env("CYPRESS_TEST_USER_EMAIL"));
  cy.findByLabelText(/password/).type(`${Cypress.env("CYPRESS_TEST_PASSWORD")}{enter}`);
  cy.findByRole("heading", { name: /battle room/i }).should("exist");
  // cy.findByRole("status", { name: new RegExp(SuccessAlerts.AUTH.LOGIN, "i") }).should("exist");
  cy.get('[data-cy="alert-element"]').findByText(new RegExp(SuccessAlerts.AUTH.LOGIN, "i")).should("exist");

  cy.visit("/settings");
  cy.findByRole("heading", { name: /settings/i }).should("exist");
  cy.findByText(`Logged in as ${Cypress.env("CYPRESS_TEST_USER_EMAIL")}`).should("exist");
  cy.get('[data-cy="profile-icon"]').click();
  cy.findByRole("link", { name: /logout/i }).click();
  cy.get('[data-cy="profile-icon"]').should("not.exist");
  cy.findByRole("link", { name: /login/i }).should("exist");
  cy.findByRole("heading", { name: /sign in/i }).should("exist");
  cy.findByRole("link", { name: /game/i }).click();
  cy.findByRole("heading", { name: /battle room/i }).should("exist");
  cy.findByRole("link", { name: /login/i }).click();
  cy.findByRole("heading", { name: /sign in/i }).should("exist");
  //
  cy.findByLabelText(/email/).type(Cypress.env("CYPRESS_TEST_USER_EMAIL"));
  cy.findByLabelText(/password/)
    .clear()
    .type(`${Cypress.env("CYPRESS_TEST_PASSWORD")}{enter}`);
  cy.get('[data-cy="profile-icon"]').should("exist");
  cy.findByRole("heading", { name: /battle room/i }).should("exist");
});

// @todo - test token expiration
