import { ERROR_MESSAGES, FrontendRoutes, SUCCESS_ALERTS } from "../../../../common";
import { APP_TEXT } from "../../../src/consts/app-text";
import { ARIA_LABELS } from "../../../src/consts/aria-labels";
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

    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`, { failOnStatusCode: false });
    cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.LOGIN }).should("exist");
    cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`)).type(Cypress.env("CYPRESS_TEST_USER_EMAIL"));
    cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(SUCCESS_ALERTS.AUTH.LOGIN, "i")).should("exist");
    cy.findByLabelText(ARIA_LABELS.USER_MENU.OPEN).click();
    cy.findByRole("link", { name: APP_TEXT.USER_MENU.ITEMS.SETTINGS }).click();
    cy.clickButton(APP_TEXT.SETTINGS.DELETE_ACCOUNT);
    cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`)).type("wrong_email@gmail.com{enter}");
    cy.findByText(new RegExp(ERROR_MESSAGES.VALIDATION.AUTH.CONFIRM_DELETE_ACCOUNT_EMAIL_MATCH, "i")).should("exist");
    cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`))
      .clear()
      .type(`${Cypress.env("CYPRESS_TEST_USER_EMAIL")}{enter}`);
    cy.findByText(new RegExp(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS, "i")).should("exist");
    cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(SUCCESS_ALERTS.USERS.ACCOUNT_DELETED, "i")).should("exist");
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.REGISTER}`);
    cy.findByRole("link", { name: APP_TEXT.AUTH.LINKS.LOG_IN }).click();
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
    cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.LOGIN }).should("exist");
    cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`)).type(`${Cypress.env("CYPRESS_TEST_USER_EMAIL")}`);
    cy.findByLabelText(APP_TEXT.AUTH.INPUTS.PASSWORD).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(ERROR_MESSAGES.AUTH.EMAIL_DOES_NOT_EXIST, "i")).should("exist");
    cy.findByRole("link", { name: APP_TEXT.AUTH.LINKS.CREATE_ACCOUNT }).click();
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.REGISTER}`);
    cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.REGISTER }).should("exist");
    cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`)).type(`${Cypress.env("CYPRESS_TEST_USER_EMAIL")}`);
    cy.findByLabelText(APP_TEXT.AUTH.INPUTS.USERNAME).type(`${Cypress.env("CYPRESS_TEST_USER_NAME")}`);
    cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}`);
    cy.findByLabelText(APP_TEXT.AUTH.INPUTS.CONFIRM_PASSWORD).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(ERROR_MESSAGES.AUTH.EMAIL_IN_USE_OR_UNAVAILABLE, "i")).should("exist");
  });
}
