import { ErrorMessages, SuccessAlerts } from "../../../common";

it(`login form shows correct errors,
    field errors dissapear when user starts typing in the respective field`, () => {
  cy.visit("/login");
  cy.url().should("be.equal", `${Cypress.env("BASE_URL")}/login`);
  cy.findByRole("heading", { name: /login/i }).should("exist");
  cy.findByRole("button", { name: /sign/i }).click();
  cy.get(`[data-cy="error-email"]`).contains(new RegExp(ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL, "i"));
  cy.get(`[data-cy="error-password"]`).contains(new RegExp(ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD, "i"));
  cy.findByLabelText(/email/).type("some_unregistered_email@gmail.com");
  cy.get(`[data-cy="error-email"]`).should("not.exist");
  cy.get(`[data-cy="error-password"]`).should("exist");
  cy.findByLabelText(/password/).type(`the wrong password`);
  cy.get(`[data-cy="error-password"]`).should("not.exist");
  cy.findByLabelText(/password/).type(`{enter}`);
  cy.findByText(new RegExp(ErrorMessages.AUTH.EMAIL_DOES_NOT_EXIST, "i")).should("exist");
  cy.get(`[data-cy="error-password"]`).should("not.exist");
  cy.findByLabelText(/email/)
    .clear()
    .type(`${Cypress.env("CYPRESS_TEST_USER_EMAIL")}{enter}`);
  cy.findByText(new RegExp(ErrorMessages.AUTH.INVALID_CREDENTIALS, "i")).should("exist");
  cy.findByLabelText(/password/)
    .clear()
    .type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
  cy.findByText(new RegExp(SuccessAlerts.AUTH.LOGIN, "i")).should("exist");
  cy.url().should("be.equal", `${Cypress.env("BASE_URL")}/battle-room`);
});

// test refresh token and token expiration

// user host/joins game, leaves game
