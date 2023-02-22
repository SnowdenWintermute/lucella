import { AuthRoutePaths, FrontendRoutes, gameRoomCountdownDuration, SocketEventsFromClient } from "../../../../common";
import { shortTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

export default function startGameAndDisconnect() {
  // eslint-disable-next-line no-undef
  before(() => {
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
  it("lets disconnecting from a game yeilds the win to the opponent", () => {
    const username = Cypress.env("CYPRESS_TEST_USER_NAME");
    // log in and host a game
    cy.request("POST", `http://localhost:8080/api${AuthRoutePaths.ROOT}`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    });
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.findByText(new RegExp(username, "i")).should("exist");
    cy.findByRole("button", { name: /Host/i }).click();
    cy.get('[data-cy="game-name-input"]').clear().click().type(`${shortTestText}{enter}`);
    cy.findByText(new RegExp(`You are the host of game: ${shortTestText}`, "i")).should("exist");
    cy.findByText(/Awaiting challenger.../i).should("exist");
    cy.findByLabelText("challenger status").find("svg").should("not.exist");
    // challenger joins game and both players ready up
    cy.task(TaskNames.connectSocket);
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.JOINS_GAME, data: shortTestText.toLowerCase() });
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.CLICKS_READY });
    cy.findByRole("button", { name: /Ready/i }).click();
    cy.wait(gameRoomCountdownDuration);
    cy.get('[data-cy="battle-room-canvas"]').should("exist");
    // challenger leaves game
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.LEAVES_GAME });
    cy.get('[data-cy="score-screen-modal"]')
      .findByText(new RegExp(`Game ${shortTestText} final score:`, "i"))
      .should("exist");
    cy.get('[data-cy="score-screen-modal"]')
      .findByText(new RegExp(`${username}:`, "i"))
      .should("exist");
    cy.get('[data-cy="score-screen-modal"]').findByText(/Anon/i).should("exist");
    cy.findByText(/No changes to ladder rating/i).should("exist");
  });
}
