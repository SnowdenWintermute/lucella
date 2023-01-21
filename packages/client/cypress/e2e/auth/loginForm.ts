import { AuthRoutePaths, ErrorMessages, FrontendRoutes, SuccessAlerts, UsersRoutePaths } from "../../../../common";
import { ButtonNames } from "../../../consts/ButtonNames";
import { TaskNames } from "../../support/TaskNames";

export default function loginForm() {
  return it(`login form shows correct errors,
  field errors dissapear when user starts typing in the respective field`, () => {
    const args = {
      CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
      CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
    };
    cy.task(TaskNames.createCypressTestUser, args).then((response: Response) => {
      expect(response.status).to.equal(201);
    });
    cy.visit(`${FrontendRoutes.LOGIN}`);
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
    cy.findByRole("heading", { name: /login/i }).should("exist");
    cy.findByRole("button", { name: new RegExp(ButtonNames.AUTH_FORMS.LOGIN, "i") }).click();
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
}
