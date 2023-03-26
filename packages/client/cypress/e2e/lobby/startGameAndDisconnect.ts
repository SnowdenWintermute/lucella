import { AuthRoutePaths, FrontendRoutes, gameRoomCountdownDuration, ONE_SECOND, PlayerRole, SocketEventsFromClient } from "../../../../common";
import { BUTTON_NAMES } from "../../../src/consts/button-names";
import { LOBBY_TEXT } from "../../../src/consts/lobby-text";
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
  it("disconnecting from a game yeilds the win to the opponent", () => {
    const username = Cypress.env("CYPRESS_TEST_USER_NAME");
    const arbitraryNameForAnonUserInCypressSocketList = "Anon1234";
    // log in and host a game
    cy.request("POST", `http://localhost:8080/api${AuthRoutePaths.ROOT}`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    });
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.findByText(new RegExp(username, "i")).should("exist");
    cy.findByRole("button", { name: /Host/i }).click();
    cy.get('[data-cy="game-name-input"]').clear().click().type(`${shortTestText}{enter}`);
    cy.findByText(new RegExp(`${LOBBY_TEXT.GAME_ROOM.GAME_NAME_HEADER}${shortTestText}`, "i")).should("be.visible");
    cy.findByText(new RegExp(LOBBY_TEXT.GAME_ROOM.GAME_STATUS_WAITING_FOR_OPPONENT, "i")).should("be.visible");
    cy.get(`[data-cy="${PlayerRole.CHALLENGER}-ready-status"]`).should("not.exist");
    // challenger joins game and both players ready up
    cy.task(TaskNames.connectSocket, { username: arbitraryNameForAnonUserInCypressSocketList });
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.JOINS_GAME,
      data: shortTestText.toLowerCase(),
    });
    cy.get(`[data-cy="${PlayerRole.CHALLENGER}-ready-status"]`).should("be.visible").should("contain.text", LOBBY_TEXT.GAME_ROOM.PLAYER_READY_STATUS.NOT_READY);
    cy.task(TaskNames.socketEmit, { username: arbitraryNameForAnonUserInCypressSocketList, event: SocketEventsFromClient.CLICKS_READY });
    cy.get(`[data-cy="${PlayerRole.CHALLENGER}-ready-status"]`).should("be.visible").should("contain.text", LOBBY_TEXT.GAME_ROOM.PLAYER_READY_STATUS.READY);
    cy.findByRole("button", { name: new RegExp(BUTTON_NAMES.GAME_ROOM.READY, "i") }).click();
    cy.get('[data-cy="battle-room-canvas"]', { timeout: gameRoomCountdownDuration * ONE_SECOND + ONE_SECOND }).should("be.visible");
    // challenger leaves game
    cy.task(TaskNames.socketEmit, { username: arbitraryNameForAnonUserInCypressSocketList, event: SocketEventsFromClient.LEAVES_GAME });
    cy.get('[data-cy="score-screen-modal"]')
      .findByText(new RegExp(LOBBY_TEXT.SCORE_SCREEN.TITLE(shortTestText.toLowerCase()), "i"))
      .should("be.visible");
    cy.get('[data-cy="score-screen-modal"]')
      .findByText(new RegExp(`${username}`, "i"))
      .should("be.visible");
    cy.get('[data-cy="score-screen-modal"]').findByText(/Anon/i).should("be.visible");
    cy.findByText(new RegExp(LOBBY_TEXT.SCORE_SCREEN.CASUAL_GAME_NO_RANK_CHANGE)).should("be.visible");
  });
}
