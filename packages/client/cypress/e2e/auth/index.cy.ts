import { TaskNames } from "../../support/TaskNames";
import accountDeletion from "./accountDeletion";
import fullUserAuthFlow from "./fullUserAuthFlow";
import loginForm from "./loginForm";
import loginLockoutAndResetFlow from "./loginLockoutAndResetFlow";
import passwordReset from "./passwordReset";

describe("user stories related to authentication, account creation and deletion", () => {
  const args = {
    CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
    CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
  };
  beforeEach(() => {
    cy.task(TaskNames.deleteAllTestUsers, args).then((response: Response) => {
      expect(response.status).to.equal(200);
    });
  });

  afterEach(() => {
    cy.task(TaskNames.setRateLimiterDisabled, { ...args, rateLimiterDisabled: false }).then((response: Response) => {
      expect(response.status).to.equal(200);
    });
  });

  // eslint-disable-next-line no-undef
  after(() => {
    cy.task(TaskNames.setRateLimiterDisabled, { ...args, rateLimiterDisabled: false }).then((response: Response) => {
      expect(response.status).to.equal(200);
    });
    cy.task(TaskNames.disconnectAllSockets);
  });

  loginForm();
  loginLockoutAndResetFlow();
  passwordReset();
  accountDeletion();
  fullUserAuthFlow();
});
