import { recurse } from "cypress-recurse";
import { ERROR_MESSAGES, failedLoginCountTolerance, FrontendRoutes, SUCCESS_ALERTS } from "../../../../common";
import { APP_TEXT } from "../../../src/consts/app-text";
import { getLastEmailTimeout } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

export default function loginLockoutAndResetFlow() {
  return it(`locks a user out upon too many login attempts and allows them to regain access upon password reset`, () => {
    let userEmail;
    cy.task(TaskNames.getUserEmail).then(async (email) => {
      // insert a user with an ethereal email and the default test user name
      expect(email).to.be.a("string");
      userEmail = email;
      const args = {
        CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
        CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
        email: userEmail,
      };
      cy.task(TaskNames.createCypressTestUser, args).then((response: Response) => {
        expect(response.status).to.equal(201);
      });

      cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`, { failOnStatusCode: false });
      const genArr = Array.from({ length: failedLoginCountTolerance }, (v, k) => k + 1); // https://stackoverflow.com/questions/52212868/cypress-io-writing-a-for-loop
      let failedAttempts = 0;
      cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.LOGIN }).should("be.visible");
      // attemp with wrong password up to the limit
      cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`))
        .clear()
        .type(userEmail);
      cy.wrap(genArr).each(() => {
        cy.findByLabelText(/^password$/i) // this is the way to match password and not password confirm field
          .clear()
          .type(`wrongPassword{enter}`);
        failedAttempts += 1;
        cy.findByText(new RegExp(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS_WITH_ATTEMPTS_REMAINING(failedLoginCountTolerance - failedAttempts), "i")).should(
          "be.visible"
        );
      });
      // go over the limit and lock out the account
      cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`))
        .clear()
        .type(userEmail);
      cy.findByLabelText(/^password$/i)
        .clear()
        .type(`wrongPassword{enter}`);
      cy.findByText(new RegExp(ERROR_MESSAGES.RATE_LIMITER.TOO_MANY_FAILED_LOGINS, "i")).should("be.visible");
      // use should not be able to log in now, even with correct password
      cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`))
        .clear()
        .type(userEmail);
      cy.findByLabelText(/^password$/i)
        .clear()
        .type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
      cy.findByText(new RegExp(ERROR_MESSAGES.AUTH.ACCOUNT_LOCKED, "i")).should("be.visible");
      // request a password reset to unlock the account
      cy.findByRole("link", { name: APP_TEXT.AUTH.LINKS.RESET_PASSWORD }).click();
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.PASSWORD_RESET_REQUEST_EMAIL).clear().type(`${userEmail}{enter}`);
      cy.findByText(new RegExp(SUCCESS_ALERTS.AUTH.CHANGE_PASSWORD_EMAIL_SENT, "i")).should("be.visible");
      // follow the link in email to change password
      recurse(() => cy.task(TaskNames.getLastEmail), Cypress._.isObject, { timeout: getLastEmailTimeout, delay: 5000 })
        .its("html")
        .then((html) => {
          cy.document({ log: false }).invoke({ log: false }, "write", html);
        });
      cy.get('[data-cy="password-reset-link"]').click();
      cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.CHANGE_PASSWORD }).should("be.visible");
      cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}`);
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.CONFIRM_PASSWORD).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
      cy.findByText(new RegExp(SUCCESS_ALERTS.AUTH.PASSWORD_CHANGED, "i")).should("be.visible");
      // user can now log in again
      cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.LOGIN }).should("be.visible");
      cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`))
        .clear()
        .type(userEmail);
      cy.findByLabelText(/^password$/i)
        .clear()
        .type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
      cy.findByText(new RegExp(SUCCESS_ALERTS.AUTH.LOGIN, "i")).should("be.visible");
    });
  });
}
