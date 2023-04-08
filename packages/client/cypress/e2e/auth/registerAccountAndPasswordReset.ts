import { recurse } from "cypress-recurse";
import { ERROR_MESSAGES, FrontendRoutes, SuccessAlerts } from "../../../../common";
import { APP_TEXT } from "../../../src/consts/app-text";
import { ARIA_LABELS } from "../../../src/consts/aria-labels";
import { getLastEmailTimeout } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

export default function passwordResetTest() {
  let userEmail;

  return it(`lets user register an account and reset their password only once with a given token and auth is revoked upon password reset`, () => {
    cy.task(TaskNames.getUserEmail).then(async (email) => {
      // confirm that an ethereal mail account was set up for this test
      expect(email).to.be.a("string");
      userEmail = email;

      cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.REGISTER}`, { failOnStatusCode: false });
      cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.REGISTER }).should("exist");
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS).type(userEmail);
      cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}`);
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.CONFIRM_PASSWORD).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}`);
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.USERNAME).type(`${Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE")}{enter}`);
      cy.findByText(new RegExp(SuccessAlerts.AUTH.ACCOUNT_ACTIVATION_EMAIL_SENT, "i")).should("exist");
      // follow the link in email to complete registration
      recurse(() => cy.task(TaskNames.getLastEmail), Cypress._.isObject, { timeout: getLastEmailTimeout, delay: 5000 })
        .its("html")
        .then((html) => {
          cy.document({ log: false }).invoke({ log: false }, "write", html);
        });
      cy.get('[data-cy="activation-link"]').click();
      cy.findByText(new RegExp(SuccessAlerts.USERS.ACCOUNT_CREATED, "i")).should("exist");
      cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS).type(`${userEmail}`);
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.PASSWORD).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
      // go to settings page and request password reset email
      cy.findByLabelText(ARIA_LABELS.USER_MENU.OPEN).click();
      cy.clickLinkAndVerifyHeading(APP_TEXT.USER_MENU.ITEMS.SETTINGS, APP_TEXT.SETTINGS.TITLE);
      cy.clickButton(APP_TEXT.SETTINGS.CHANGE_PASSWORD);
      cy.findByText(new RegExp(SuccessAlerts.AUTH.CHANGE_PASSWORD_EMAIL_SENT, "i")).should("exist");
      // follow the link in email to change password
      recurse(() => cy.task(TaskNames.getLastEmail), Cypress._.isObject, { timeout: getLastEmailTimeout, delay: 5000 })
        .its("html")
        .then((html) => {
          cy.document({ log: false }).invoke({ log: false }, "write", html);
        });
      cy.get('[data-cy="password-reset-link"]').click();
      cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.CHANGE_PASSWORD }).should("exist");
      cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}`);
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.CONFIRM_PASSWORD).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
      cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
      cy.findByLabelText(ARIA_LABELS.USER_MENU.OPEN).should("not.exist");
      cy.findByRole("link", { name: APP_TEXT.USER_MENU.LOGIN }).should("exist");
      cy.go("back");
      cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.CHANGE_PASSWORD }).should("exist");
      cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}`);
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.CONFIRM_PASSWORD).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
      cy.findByText(new RegExp(ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN, "i")).should("exist");
    });
  });
}
