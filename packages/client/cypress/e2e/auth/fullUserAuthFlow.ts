import { ERROR_MESSAGES, FrontendRoutes, nameMaxLength, passwordMaxLength, SUCCESS_ALERTS } from "../../../../common";
import { TaskNames } from "../../support/TaskNames";
import { BUTTON_NAMES } from "../../../src/consts/button-names";
import { APP_TEXT } from "../../../src/consts/app-text";
import { ARIA_LABELS } from "../../../src/consts/aria-labels";

export default function fullUserAuthFlow() {
  let userEmail;

  const args = {
    CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
    CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
  };

  return it(`
    user can't visit protected routes until logged in,
    user register and login,
    form errors work,
    user can only visit auth protected pages when authenticated,
    user can reset their password`, () => {
    // if we don't disable the rate limiter cypress will exceed the rate limit, we make sure to reset the limiter in the after() function of this spec (auth.cy.ts)
    cy.task(TaskNames.setRateLimiterDisabled, { ...args, rateLimiterDisabled: true }).then((response: Response) => {
      expect(response.status).to.equal(200);
    });
    cy.task(TaskNames.createCypressTestUser, args).then((response: Response) => {
      expect(response.status).to.equal(201);
    });
    cy.task(TaskNames.getUserEmail).then(async (email) => {
      // confirm that an ethereal mail account was set up for this test
      expect(email).to.be.a("string");
      userEmail = email;

      // at this point we should be logged out
      // can't visit protected route if not logged in
      cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.SETTINGS}`, { failOnStatusCode: false });
      cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
      cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.LOGIN }).should("be.visible");
      // show login instead of profile icon if not logged in
      cy.findByLabelText(ARIA_LABELS.USER_MENU.OPEN).should("not.exist");
      cy.findByRole("link", { name: APP_TEXT.USER_MENU.LOGIN }).should("be.visible");
      // start account creation process
      cy.findByRole("link", { name: new RegExp(BUTTON_NAMES.AUTH_FORMS.CREATE_ACCOUNT, "i") }).click();
      cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.REGISTER}`);
      cy.findByRole("heading", { name: new RegExp(BUTTON_NAMES.AUTH_FORMS.CREATE_ACCOUNT, "i") }).should("be.visible");
      // test registration form errors
      cy.findByRole("button", { name: new RegExp(BUTTON_NAMES.AUTH_FORMS.CREATE_ACCOUNT, "i") }).click();
      cy.get(`[data-cy="error-email"]`).contains(new RegExp(ERROR_MESSAGES.VALIDATION.AUTH.INVALID_EMAIL, "i"));
      cy.get(`[data-cy="error-name"]`).contains(new RegExp(ERROR_MESSAGES.VALIDATION.AUTH.NAME_MIN_LENGTH, "i"));
      cy.get(`[data-cy="error-password"]`).contains(new RegExp(ERROR_MESSAGES.VALIDATION.AUTH.PASSWORD_MIN_LENGTH, "i"));
      cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`)).type(Cypress.env("CYPRESS_TEST_USER_EMAIL"));
      let tooLongPassword = "";
      for (let i = passwordMaxLength + 1; i > 0; i -= 1) tooLongPassword += "1";
      cy.findByLabelText(new RegExp(`Password - ${ERROR_MESSAGES.VALIDATION.AUTH.PASSWORD_MIN_LENGTH}`, "i")).type(`${tooLongPassword}{enter}`);
      cy.get(`[data-cy="error-password"]`).contains(new RegExp(ERROR_MESSAGES.VALIDATION.AUTH.PASSWORD_MAX_LENGTH, "i"));
      cy.get(`[data-cy="error-passwordConfirm"]`).contains(new RegExp(ERROR_MESSAGES.VALIDATION.AUTH.PASSWORDS_DONT_MATCH, "i"));
      let tooLongName = "";
      for (let i = nameMaxLength + 1; i > 0; i -= 1) tooLongName += "1";
      cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.USERNAME}.*`)).type(`${tooLongName}{enter}`);
      cy.get(`[data-cy="error-name"]`).contains(new RegExp(ERROR_MESSAGES.VALIDATION.AUTH.NAME_MAX_LENGTH, "i"));
      // valid password and email but duplicate name
      cy.findByLabelText(new RegExp(`Password - ${ERROR_MESSAGES.VALIDATION.AUTH.PASSWORD_MAX_LENGTH}`, "i"))
        .clear()
        .type(Cypress.env("CYPRESS_TEST_USER_PASSWORD"));
      cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.CONFIRM_PASSWORD}.*`))
        .clear()
        .type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
      cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`))
        .clear()
        .type(userEmail);
      cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.USERNAME}.*`))
        .clear()
        .type(`${Cypress.env("CYPRESS_TEST_USER_NAME")}{enter}`);
      cy.findByText(new RegExp(ERROR_MESSAGES.AUTH.NAME_IN_USE_OR_UNAVAILABLE)).should("be.visible");
      // duplicate email
      cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.USERNAME}.*`))
        .clear()
        .type(Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE"));
      cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`))
        .clear()
        .type(`${Cypress.env("CYPRESS_TEST_USER_EMAIL")}{enter}`);
      cy.findByText(new RegExp(ERROR_MESSAGES.AUTH.EMAIL_IN_USE_OR_UNAVAILABLE)).should("be.visible");
      // all fields valid
      cy.findByLabelText(new RegExp(`${APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS}.*`))
        .clear()
        .type(`${userEmail}{enter}`);
      cy.findByText(new RegExp(SUCCESS_ALERTS.AUTH.ACCOUNT_ACTIVATION_EMAIL_SENT, "i")).should("be.visible");
      // follow the link in email to complete registration
      cy.openLastEmail();
      cy.get('[data-cy="activation-link"]').click();
      cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.ACCOUNT_ACTIVATION }).should("be.visible");
      cy.findByText(new RegExp(SUCCESS_ALERTS.USERS.ACCOUNT_CREATED, "i")).should("be.visible");
      // redirected to login after account creation completed
      cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
      cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.LOGIN }).should("be.visible");
      // enter valid login form data
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS).clear().type(userEmail);
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.PASSWORD)
        .clear()
        .type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
      // after successful login...
      cy.findByText(new RegExp(SUCCESS_ALERTS.AUTH.LOGIN, "i")).should("be.visible");
      cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
      cy.findByLabelText(ARIA_LABELS.USER_MENU.OPEN).should("be.visible").click();
      cy.findByRole("link", { name: APP_TEXT.USER_MENU.ITEMS.SETTINGS }).click();
      cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.SETTINGS}`);
      // logout should kick user from authed routes and show login link instead of user menu
      cy.findByLabelText(ARIA_LABELS.USER_MENU.OPEN).should("be.visible").click();
      cy.findByRole("link", { name: APP_TEXT.USER_MENU.ITEMS.LOGOUT }).click();
      cy.findByLabelText(ARIA_LABELS.USER_MENU.OPEN).should("not.exist");
      cy.findByRole("link", { name: APP_TEXT.USER_MENU.LOGIN }).should("be.visible");
      cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
      // login again and test password reset function
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.PASSWORD).type(Cypress.env("CYPRESS_TEST_USER_PASSWORD"));
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS).type(`${userEmail}{enter}`);
      cy.findByLabelText(ARIA_LABELS.USER_MENU.OPEN).should("be.visible").click();
      cy.findByRole("link", { name: APP_TEXT.USER_MENU.ITEMS.SETTINGS }).click();
      cy.clickButton(APP_TEXT.SETTINGS.CHANGE_PASSWORD);
      cy.findByText(new RegExp(SUCCESS_ALERTS.AUTH.CHANGE_PASSWORD_EMAIL_SENT, "i")).should("be.visible");
      // follow the link in email to change password
      cy.openLastEmail();
      cy.get('[data-cy="password-reset-link"]').click();
      cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.CHANGE_PASSWORD }).should("be.visible");
      cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD_ALTERNATE")}`);
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.CONFIRM_PASSWORD).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD_ALTERNATE")}{enter}`);
      cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
      cy.findByLabelText(ARIA_LABELS.USER_MENU.OPEN).should("not.exist");
      // can't use same link/token once already used
      cy.go("back");
      cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.CHANGE_PASSWORD }).should("exist");
      cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD_ALTERNATE")}`);
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.CONFIRM_PASSWORD).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD_ALTERNATE")}{enter}`);
      cy.findByText(new RegExp(ERROR_MESSAGES.AUTH.INVALID_OR_EXPIRED_TOKEN, "i")).should("exist");
      // able to log in with new password
      cy.findByRole("link", { name: APP_TEXT.AUTH.LINKS.LOG_IN }).click();
      cy.findByRole("heading", { name: APP_TEXT.AUTH.PAGE_TITLES.LOGIN }).should("exist");
      cy.findByLabelText(APP_TEXT.AUTH.INPUTS.EMAIL_ADDRESS).type(userEmail);
      cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD_ALTERNATE")}{enter}`);
      cy.findByLabelText(ARIA_LABELS.USER_MENU.OPEN).should("be.visible").click();
      cy.findByRole("link", { name: APP_TEXT.USER_MENU.ITEMS.SETTINGS }).click();
      cy.findByRole("heading", { name: APP_TEXT.SETTINGS.TITLE }).should("exist");
    });
  });
}
