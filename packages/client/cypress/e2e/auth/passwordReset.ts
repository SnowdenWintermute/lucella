import { recurse } from "cypress-recurse";
import { ErrorMessages, FrontendRoutes, SuccessAlerts } from "../../../../common";
import { TaskNames } from "../../support/TaskNames";

export default function passwordResetTest() {
  let userEmail;

  return it(`lets user reset their password only once with a given token and auth is revoked upon password reset`, () => {
    cy.task(TaskNames.getUserEmail).then(async (email) => {
      // confirm that an ethereal mail account was set up for this test
      expect(email).to.be.a("string");
      userEmail = email;

      cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.REGISTER}`);
      cy.findByLabelText(/email address/i).type(userEmail);
      cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}`);
      cy.findByLabelText(/confirm password/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}`);
      cy.findByLabelText(/username/i).type(`${Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE")}{enter}`);
      cy.findByText(new RegExp(SuccessAlerts.AUTH.ACCOUNT_ACTIVATION_EMAIL_SENT, "i")).should("exist");
      // follow the link in email to complete registration
      recurse(() => cy.task(TaskNames.getLastEmail), Cypress._.isObject, { timeout: 90000, delay: 5000 })
        .its("html")
        .then((html) => {
          cy.document({ log: false }).invoke({ log: false }, "write", html);
        });
      cy.get('[data-cy="activation-link"]').click();
      cy.findByText(new RegExp(SuccessAlerts.USERS.ACCOUNT_CREATED, "i")).should("exist");
      cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
      cy.findByLabelText(/email/).type(`${userEmail}`);
      cy.findByLabelText(/password/).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
      // go to settings page and request password reset email
      cy.get('[data-cy="profile-icon"]').click();
      cy.findByRole("link", { name: /settings/i }).click();
      cy.findByRole("button", { name: /change password/i }).click();
      cy.findByText(new RegExp(SuccessAlerts.AUTH.CHANGE_PASSWORD_EMAIL_SENT, "i")).should("exist");
      // follow the link in email to change password
      recurse(() => cy.task(TaskNames.getLastEmail), Cypress._.isObject, { timeout: 90000, delay: 5000 })
        .its("html")
        .then((html) => {
          cy.document({ log: false }).invoke({ log: false }, "write", html);
        });
      cy.get('[data-cy="password-reset-link"]').click();
      cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}`);
      cy.findByLabelText(/confirm password/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
      cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
      cy.get('[data-cy="profile-icon"]').should("not.exist");
      cy.findByRole("link", { name: /login/i }).should("exist");
      cy.go("back");
      cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}`);
      cy.findByLabelText(/confirm password/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
      cy.findByText(new RegExp(ErrorMessages.AUTH.INVALID_OR_EXPIRED_TOKEN, "i")).should("exist");
    });
  });
}
