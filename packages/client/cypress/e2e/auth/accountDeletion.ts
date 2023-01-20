import { ErrorMessages, FrontendRoutes, SuccessAlerts } from "../../../../common";
import { TaskNames } from "../../support/TaskNames";

export default function accountDeletion() {
  return it(`upon receiving credentials lets user delete their account,
    user can not log in after account is deleted
    and new accounts by the same name cannot be created`, () => {
    const args = {
      CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
      CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
    };
    cy.task(TaskNames.createCypressTestUser, args).then((response: Response) => {
      expect(response.status).to.equal(201);
    });

    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
    cy.findByRole("heading", { name: /login/i }).should("exist");
    cy.findByLabelText(/email address/i).type(Cypress.env("CYPRESS_TEST_USER_EMAIL"));
    cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(SuccessAlerts.AUTH.LOGIN, "i")).should("exist");
    cy.get('[data-cy="profile-icon"]').click();
    cy.findByRole("link", { name: /settings/i }).click();
    cy.findByRole("button", { name: /delete account/i }).click();
    cy.findByLabelText(/email address/i).type("wrong_email@gmail.com{enter}");
    cy.findByText(new RegExp(ErrorMessages.VALIDATION.AUTH.CONFIRM_DELETE_ACCOUNT_EMAIL_MATCH, "i")).should("exist");
    cy.findByLabelText(/email address/i)
      .clear()
      .type(`${Cypress.env("CYPRESS_TEST_USER_EMAIL")}{enter}`);
    cy.findByText(new RegExp(ErrorMessages.AUTH.INVALID_CREDENTIALS, "i")).should("exist");
    cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(SuccessAlerts.USERS.ACCOUNT_DELETED, "i")).should("exist");
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.REGISTER}`);
    cy.findByRole("link", { name: /login/i }).click();
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
    cy.findByRole("heading", { name: /login/i }).should("exist");
    cy.findByLabelText(/email address/i).type(`${Cypress.env("CYPRESS_TEST_USER_EMAIL")}`);
    cy.findByLabelText(/password/).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(ErrorMessages.AUTH.EMAIL_DOES_NOT_EXIST, "i")).should("exist");
    cy.findByRole("link", { name: /create account/i }).click();
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.REGISTER}`);
    cy.findByRole("heading", { name: /create account/i }).should("exist");
    cy.findByLabelText(/email address/i).type(`${Cypress.env("CYPRESS_TEST_USER_EMAIL")}`);
    cy.findByLabelText(/username/i).type(`${Cypress.env("CYPRESS_TEST_USER_NAME")}`);
    cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}`);
    cy.findByLabelText(/confirm password/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(ErrorMessages.AUTH.EMAIL_IN_USE_OR_UNAVAILABLE, "i")).should("exist");
  });
}
