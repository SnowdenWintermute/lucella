import { ErrorMessages, gameRoomCountdownDuration, GameStatus, SocketEventsFromClient } from "../../../../common";
import { mediumTestText, shortTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

export default function authedUserHostAndStartGame() {
  it("lets authed user host a game that another player can join and leave", () => {
    const username = Cypress.env("CYPRESS_TEST_USER_NAME");
    // log in and host a game
    cy.request("POST", `http://localhost:8080/api/auth/login`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_PASSWORD"),
    });
    cy.visit("/battle-room");
    cy.findByText(username).should("exist");
    cy.findByRole("button", { name: new RegExp("Host", "i") }).click();
    cy.get('[data-cy="game-name-input"]').click().type("{enter}");
    cy.findByText(new RegExp(`You are the host of game:`, "i")).should("not.exist");
    cy.findByText(ErrorMessages.GAME_NAME.NOT_ENTERED).should("exist");
    cy.get('[data-cy="game-name-input"]').click().type(`${mediumTestText}{enter}`);
    cy.findByText(ErrorMessages.GAME_NAME.MAX_LENGTH).should("exist");
    cy.get('[data-cy="game-name-input"]').clear().click().type(`${shortTestText}{enter}`);
    cy.findByText(new RegExp(`You are the host of game: ${shortTestText}`, "i")).should("exist");
    cy.findByText(new RegExp("Awaiting challenger...", "i")).should("exist");
    cy.findByLabelText("challenger status").find("svg").should("not.exist");
    // challenger joins game, toggles buttons and leaves
    cy.task(TaskNames.connectSocket);
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.JOINS_GAME, data: shortTestText.toLowerCase() });
    cy.findByText(new RegExp("Awaiting challenger...", "i")).should("not.exist");
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.CLICKS_READY });
    cy.findByLabelText("challenger status").find("svg").should("exist");
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.LEAVES_GAME });
    cy.findByLabelText("challenger status").find("svg").should("not.exist");
    cy.findByText(new RegExp("Awaiting challenger...", "i")).should("exist");
    // challenger rejoins, all players ready up then challenger disconnects
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.JOINS_GAME, data: shortTestText.toLowerCase() });
    cy.findByText(new RegExp("Awaiting challenger...", "i")).should("not.exist");
    cy.get('[data-cy="challenger-info"]').findByText(new RegExp("Anon", "i")).should("exist");
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.CLICKS_READY });
    cy.findByLabelText("challenger status").find("svg").should("exist");
    cy.findByLabelText("host status").find("svg").should("not.exist");
    cy.findByRole("button", { name: new RegExp("Ready", "i") }).click();
    cy.findByLabelText("host status").find("svg").should("exist");
    cy.findByText(GameStatus.COUNTING_DOWN).should("exist");
    cy.task(TaskNames.disconnectSocket);
    cy.findByText(GameStatus.COUNTING_DOWN).should("not.exist");
    cy.findByText(GameStatus.IN_LOBBY).should("exist");
    cy.findByLabelText("challenger status").find("svg").should("not.exist");
    cy.findByLabelText("host status").find("svg").should("not.exist");
    // go back to lobby
    cy.findByRole("button", { name: new RegExp("Leave Game", "i") }).click();
    cy.findByText(new RegExp(`You are the host of game: ${shortTestText}`, "i")).should("not.exist");
    cy.findByRole("button", { name: new RegExp("Channel", "i") }).should("exist");
    cy.findByRole("button", { name: new RegExp("Ranked", "i") }).should("exist");
    cy.findByRole("button", { name: new RegExp("Host", "i") }).should("exist");
    cy.findByRole("button", { name: new RegExp("Join", "i") }).click();
    cy.get('[data-cy="list-of-current-games"]').findByText(new RegExp(shortTestText, "i")).should("not.exist");
    cy.findByRole("button", { name: new RegExp("Back", "i") }).click();
    cy.findByRole("button", { name: new RegExp("Host", "i") }).click();
    // host the game again
    cy.get('[data-cy="game-name-input"]').clear().click().type(`${shortTestText}{enter}`);
    cy.findByText(new RegExp(`You are the host of game: ${shortTestText}`, "i")).should("exist");
    cy.findByText(new RegExp("Awaiting challenger...", "i")).should("exist");
    // challenger reconnects, rejoins game and all players ready - game starts
    cy.task(TaskNames.connectSocket);
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.JOINS_GAME, data: shortTestText.toLowerCase() });
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.CLICKS_READY });
    cy.findByRole("button", { name: new RegExp("Ready", "i") }).click();
    cy.wait(gameRoomCountdownDuration);
    cy.get('[data-cy="battle-room-canvas"]').should("exist");
    // challenger leaves game
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.LEAVES_GAME, data: shortTestText });
    cy.get('[data-cy="score-screen-modal"]')
      .findByText(new RegExp(`Game ${shortTestText} final score:`, "i"))
      .should("exist");
    cy.get('[data-cy="score-screen-modal"]').findByText(`${username}:`).should("exist");
    cy.get('[data-cy="score-screen-modal"]').findByText(new RegExp("Anon", "i")).should("exist");
    cy.findByText(new RegExp(`No changes to ladder rating`, "i")).should("exist");
    cy.get("body").trigger("keyup", { key: "Escape" });
    cy.get('[data-cy="score-screen-modal"]').should("not.exist");
  });
}