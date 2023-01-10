import { recurse } from "cypress-recurse";
import { ErrorMessages, failedLoginCountTolerance, FrontendRoutes, SuccessAlerts } from "../../../common";
import { TaskNames } from "../support/TaskNames";

describe("login-lockout-and-reset-flow", () => {
  let userEmail;

  // eslint-disable-next-line no-undef
  before(() => {
    cy.task(TaskNames.getUserEmail).then(async (email) => {
      // insert a user with an ethereal email and the default test user name
      expect(email).to.be.a("string");
      userEmail = email;
      const args = {
        CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
        CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
        email: userEmail,
      };
      cy.task(TaskNames.deleteAllTestUsers, args).then((response: Response) => {
        expect(response.status).to.equal(200);
      });
      cy.task(TaskNames.createCypressTestUser, args).then((response: Response) => {
        expect(response.status).to.equal(201);
      });
    });
  });

  it(`locks a user out upon too many login attempts and allows them to regain access upon password reset`, () => {
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
    const genArr = Array.from({ length: failedLoginCountTolerance - 1 }, (v, k) => k + 1); // https://stackoverflow.com/questions/52212868/cypress-io-writing-a-for-loop
    let failedAttempts = 0;
    // attemp with wrong password up to the limit
    cy.findByLabelText(/email address/i)
      .clear()
      .type(userEmail);
    cy.wrap(genArr).each((index) => {
      cy.findByLabelText(/^password$/i)
        .clear()
        .type(`wrongPassword{enter}`);
      failedAttempts += 1;
      cy.findByText(new RegExp(ErrorMessages.AUTH.INVALID_CREDENTIALS_WITH_ATTEMPTS_REMAINING(failedLoginCountTolerance - failedAttempts), "i")).should(
        "exist"
      );
    });
    // go over the limit and lock out the account
    cy.findByLabelText(/email address/i)
      .clear()
      .type(userEmail);
    cy.findByLabelText(/^password$/i)
      .clear()
      .type(`wrongPassword{enter}`);
    cy.findByText(new RegExp(ErrorMessages.RATE_LIMITER.TOO_MANY_FAILED_LOGINS, "i")).should("exist");
    // use should not be able to log in now, even with correct password
    cy.findByLabelText(/email address/i)
      .clear()
      .type(userEmail);
    cy.findByLabelText(/^password$/i)
      .clear()
      .type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(ErrorMessages.AUTH.ACCOUNT_LOCKED, "i")).should("exist");
    // request a password reset to unlock the account
    cy.findByRole("link", { name: /reset password/i }).click();
    cy.findByLabelText(/Enter your email to request a password reset./i)
      .clear()
      .type(`${userEmail}{enter}`);
    cy.findByText(new RegExp(SuccessAlerts.AUTH.CHANGE_PASSWORD_EMAIL_SENT, "i")).should("exist");
    // follow the link in email to change password
    recurse(() => cy.task(TaskNames.getLastEmail), Cypress._.isObject, { timeout: 60000, delay: 5000 })
      .its("html")
      .then((html) => {
        cy.document({ log: false }).invoke({ log: false }, "write", html);
      });
    cy.get('[data-cy="password-reset-link"]').click();
    cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}`);
    cy.findByLabelText(/confirm password/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(SuccessAlerts.AUTH.PASSWORD_CHANGED, "i")).should("exist");
    // user can now log in again
    cy.findByRole("heading", { name: /login/i }).should("exist");
    cy.findByLabelText(/email address/i)
      .clear()
      .type(userEmail);
    cy.findByLabelText(/^password$/i)
      .clear()
      .type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(SuccessAlerts.AUTH.LOGIN, "i")).should("exist");
  });
});
