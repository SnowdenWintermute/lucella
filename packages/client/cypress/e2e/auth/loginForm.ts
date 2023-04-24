import { ERROR_MESSAGES, FrontendRoutes, SUCCESS_ALERTS } from "../../../../common";
import { APP_TEXT } from "../../../src/consts/app-text";
import { BUTTON_NAMES } from "../../../src/consts/button-names";
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
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`, { failOnStatusCode: false });
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
    cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.LOGIN }).should("be.visible");
    cy.clickButton(BUTTON_NAMES.AUTH_FORMS.LOGIN);
    cy.get(`[data-cy="error-email"]`).contains(new RegExp(ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL, "i"));
    cy.get(`[data-cy="error-password"]`).contains(new RegExp(ERROR_MESSAGES.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD, "i"));
    cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`)).type("some_unregistered_email@gmail.com");
    cy.get(`[data-cy="error-email"]`).should("not.exist");
    cy.get(`[data-cy="error-password"]`).should("exist");
    cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.PASSWORD}.*`)).type(`the wrong password`);
    cy.get(`[data-cy="error-password"]`).should("not.exist");
    cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.PASSWORD}.*`)).type(`{enter}`);
    cy.findByText(new RegExp(ERROR_MESSAGES.AUTH.EMAIL_DOES_NOT_EXIST, "i")).should("exist");
    cy.get(`[data-cy="error-password"]`).should("not.exist");
    cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`))
      .clear()
      .type(`${Cypress.env("CYPRESS_TEST_USER_EMAIL")}{enter}`);
    cy.findByText(new RegExp(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, "i")).should("exist");
    cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.PASSWORD}.*`))
      .clear()
      .type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(SUCCESS_ALERTS.AUTH.LOGIN, "i")).should("exist");
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}/battle-room`);
  });
}
