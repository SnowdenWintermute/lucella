import { recurse } from "cypress-recurse";
import { ErrorMessages, FrontendRoutes, nameMaxLength, passwordMaxLength, SuccessAlerts } from "../../../common";
import { TaskNames } from "../support/TaskNames";
import { ButtonNames } from "../../consts/ButtonNames";

describe("full user authentication flow", () => {
  let userEmail;

  // eslint-disable-next-line no-undef
  before(() => {
    cy.task(TaskNames.getUserEmail).then(async (email) => {
      // confirm that an ethereal mail account was set up for this test
      expect(email).to.be.a("string");
      userEmail = email;
    });
    const args = {
      CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
      CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
    };
    // delete all test users (test users are defined in the UsersRepo deleteTestUsers method)
    cy.task(TaskNames.deleteAllTestUsers, args).then((response: Response) => {
      expect(response.status).to.equal(200);
    });
    cy.task(TaskNames.createCypressTestUser, args).then((response: Response) => {
      expect(response.status).to.equal(201);
    });
  });

  it(`lets user register and login,
    form errors work,
    user can only visit auth protected pages when authenticated,
    user can reset their password`, () => {
    // test deleting account with user created in test setup
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
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
    cy.findByLabelText(/email address/i).type(`${Cypress.env("CYPRESS_TEST_USER_EMAIL")}`);
    cy.findByLabelText(/password/).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(ErrorMessages.AUTH.EMAIL_DOES_NOT_EXIST, "i")).should("exist");
    cy.findByRole("link", { name: /create account/i }).click();
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.REGISTER}`);
    cy.findByLabelText(/email address/i).type(`${Cypress.env("CYPRESS_TEST_USER_EMAIL")}`);
    cy.findByLabelText(/username/i).type(`${Cypress.env("CYPRESS_TEST_USER_NAME")}`);
    cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}`);
    cy.findByLabelText(/confirm password/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByText(new RegExp(ErrorMessages.AUTH.EMAIL_IN_USE_OR_UNAVAILABLE, "i")).should("exist");
    // at this point we should be logged out
    // can't visit protected route if not logged in
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.SETTINGS}`);
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
    cy.findByRole("heading", { name: /login/i }).should("exist");
    // show login instead of profile icon if not logged in
    cy.get('[data-cy="profile-icon"]').should("not.exist");
    cy.findByRole("link", { name: /login/i }).should("exist");
    // start account creation process
    cy.findByRole("link", { name: new RegExp(ButtonNames.AUTH_FORMS.CREATE_ACCOUNT, "i") }).click();
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}/register`);
    cy.findByRole("heading", { name: new RegExp(ButtonNames.AUTH_FORMS.CREATE_ACCOUNT, "i") }).should("exist");
    // test registration form errors
    cy.findByRole("button", { name: new RegExp(ButtonNames.AUTH_FORMS.CREATE_ACCOUNT, "i") }).click();
    cy.get(`[data-cy="error-email"]`).contains(new RegExp(ErrorMessages.VALIDATION.AUTH.INVALID_EMAIL, "i"));
    cy.get(`[data-cy="error-name"]`).contains(new RegExp(ErrorMessages.VALIDATION.AUTH.NAME_MIN_LENGTH, "i"));
    cy.get(`[data-cy="error-password"]`).contains(new RegExp(ErrorMessages.VALIDATION.AUTH.PASSWORD_MIN_LENGTH, "i"));
    cy.findByLabelText(/Email Address/i, {}).type(Cypress.env("CYPRESS_TEST_USER_EMAIL"));
    let tooLongPassword = "";
    for (let i = passwordMaxLength + 1; i > 0; i -= 1) tooLongPassword += "1";
    cy.findByLabelText(new RegExp(`Password - ${ErrorMessages.VALIDATION.AUTH.PASSWORD_MIN_LENGTH}`, "i")).type(`${tooLongPassword}{enter}`);
    cy.get(`[data-cy="error-password"]`).contains(new RegExp(ErrorMessages.VALIDATION.AUTH.PASSWORD_MAX_LENGTH, "i"));
    cy.get(`[data-cy="error-passwordConfirm"]`).contains(new RegExp(ErrorMessages.VALIDATION.AUTH.PASSWORDS_DONT_MATCH, "i"));
    let tooLongName = "";
    for (let i = nameMaxLength + 1; i > 0; i -= 1) tooLongName += "1";
    cy.findByLabelText(/Username/i).type(`${tooLongName}{enter}`);
    cy.get(`[data-cy="error-name"]`).contains(new RegExp(ErrorMessages.VALIDATION.AUTH.NAME_MAX_LENGTH, "i"));
    // valid passoword and email but duplicate name
    cy.findByLabelText(new RegExp(`Password - ${ErrorMessages.VALIDATION.AUTH.PASSWORD_MAX_LENGTH}`, "i"))
      .clear()
      .type(Cypress.env("CYPRESS_TEST_USER_PASSWORD"));
    cy.findByLabelText(/confirm password/i)
      .clear()
      .type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    cy.findByLabelText(/email address/i)
      .clear()
      .type(userEmail);
    cy.findByLabelText(/username/i)
      .clear()
      .type(`${Cypress.env("CYPRESS_TEST_USER_NAME")}{enter}`);
    cy.findByText(new RegExp(ErrorMessages.AUTH.NAME_IN_USE_OR_UNAVAILABLE)).should("exist");
    // duplicate email
    cy.findByLabelText(/username/i)
      .clear()
      .type(Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE"));
    cy.findByLabelText(/email address/i)
      .clear()
      .type(`${Cypress.env("CYPRESS_TEST_USER_EMAIL")}{enter}`);
    cy.findByText(new RegExp(ErrorMessages.AUTH.EMAIL_IN_USE_OR_UNAVAILABLE)).should("exist");
    // all fields valid
    cy.findByLabelText(/email address/i)
      .clear()
      .type(`${userEmail}{enter}`);

    cy.findByText(new RegExp(SuccessAlerts.AUTH.ACCOUNT_ACTIVATION_EMAIL_SENT, "i")).should("exist");

    // follow the link in email to complete registration
    recurse(() => cy.task(TaskNames.getLastEmail), Cypress._.isObject, { timeout: 60000, delay: 5000 })
      .its("html")
      .then((html) => {
        cy.document({ log: false }).invoke({ log: false }, "write", html);
      });
    cy.get('[data-cy="activation-link"]').click();
    cy.findByText(new RegExp(SuccessAlerts.USERS.ACCOUNT_CREATED, "i")).should("exist");
    // redirected to login after account creation completed
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
    cy.findByRole("heading", { name: /login/i }).should("exist");
    // test possible login form errors
    cy.findByRole("button", { name: new RegExp(ButtonNames.AUTH_FORMS.LOGIN, "i") }).click();
    cy.get(`[data-cy="error-email"]`).contains(new RegExp(ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.EMAIL, "i"));
    cy.get(`[data-cy="error-password"]`).contains(new RegExp(ErrorMessages.VALIDATION.AUTH.REQUIRED_FIELD.PASSWORD, "i"));
    cy.findByLabelText(/email/).type("unregistered@gmail.com");
    cy.get(`[data-cy="error-email"]`).should("not.exist");
    cy.get(`[data-cy="error-password"]`).should("exist");
    cy.findByLabelText(/password/).type(`the wrong password`);
    cy.get(`[data-cy="error-password"]`).should("not.exist");
    cy.findByLabelText(/password/).type(`{enter}`);
    // enter valid login form data
    cy.findByText(new RegExp(ErrorMessages.AUTH.EMAIL_DOES_NOT_EXIST, "i")).should("exist");
    cy.get(`[data-cy="error-password"]`).should("not.exist");
    cy.findByLabelText(/email/).clear().type(`${userEmail}{enter}`);
    cy.findByText(new RegExp(ErrorMessages.AUTH.INVALID_CREDENTIALS, "i")).should("exist");
    cy.findByLabelText(/password/)
      .clear()
      .type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD")}{enter}`);
    // after successful login...
    cy.findByText(new RegExp(SuccessAlerts.AUTH.LOGIN, "i")).should("exist");
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}/battle-room`);
    cy.get('[data-cy="profile-icon"]').click();
    cy.findByRole("link", { name: /settings/i }).click();
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.SETTINGS}`);
    // logout should kick user from authed routes and show login link instead of user menu
    cy.get('[data-cy="profile-icon"]').click();
    cy.findByRole("link", { name: /logout/i }).click();
    cy.get('[data-cy="profile-icon"]').should("not.exist");
    cy.findByRole("link", { name: /login/i }).should("exist");
    // login again and test password reset function
    cy.findByLabelText(/password/i).type(Cypress.env("CYPRESS_TEST_USER_PASSWORD"));
    cy.findByLabelText(/email address/i).type(`${userEmail}{enter}`);

    cy.get('[data-cy="profile-icon"]').click();
    cy.findByRole("link", { name: /settings/i }).click();
    cy.findByRole("button", { name: /change password/i }).click();
    cy.findByText(new RegExp(SuccessAlerts.AUTH.CHANGE_PASSWORD_EMAIL_SENT, "i")).should("exist");
    // follow the link in email to change password
    recurse(() => cy.task(TaskNames.getLastEmail), Cypress._.isObject, { timeout: 60000, delay: 5000 })
      .its("html")
      .then((html) => {
        cy.document({ log: false }).invoke({ log: false }, "write", html);
      });
    cy.get('[data-cy="password-reset-link"]').click();
    cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD_ALTERNATE")}`);
    cy.findByLabelText(/confirm password/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD_ALTERNATE")}{enter}`);
    cy.url().should("be.equal", `${Cypress.env("BASE_URL")}${FrontendRoutes.LOGIN}`);
    cy.get('[data-cy="profile-icon"]').should("not.exist");
    cy.findByRole("link", { name: /login/i }).should("exist");
    cy.go("back");
    // can't use same link/token once already used
    cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD_ALTERNATE")}`);
    cy.findByLabelText(/confirm password/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD_ALTERNATE")}{enter}`);
    cy.findByText(new RegExp(ErrorMessages.AUTH.INVALID_OR_EXPIRED_TOKEN, "i")).should("exist");
    // able to log in with new password
    cy.findByRole("link", { name: /login/i }).click();
    cy.findByLabelText(/email address/i).type(userEmail);
    cy.findByLabelText(/^password$/i).type(`${Cypress.env("CYPRESS_TEST_USER_PASSWORD_ALTERNATE")}{enter}`);
    cy.get('[data-cy="profile-icon"]').click();
    cy.findByRole("link", { name: /settings/i }).click();
    cy.findByRole("heading", { name: /settings/i }).should("exist");
  });
});
