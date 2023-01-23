import {
  AuthRoutePaths,
  battleRoomDefaultChatChannel,
  ErrorMessages,
  FrontendRoutes,
  gameRoomCountdownDuration,
  GameStatus,
  OfficialChannels,
  SocketEventsFromClient,
} from "../../../../common";
import { mediumTestText, shortTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

describe("play game", () => {
  // eslint-disable-next-line no-undef
  before(() => {
    const args = {
      CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
      CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
    };
    // delete all test users (test users are defined in the UsersRepo deleteTestUsers method)
    cy.task(TaskNames.deleteAllTestUsers, args).then((response: Response) => {
      expect(response.status).to.equal(200);
      cy.task(TaskNames.createCypressTestUser, args).then((firstCreateTestUserResponse: Response) => {
        expect(firstCreateTestUserResponse.status).to.equal(201);
      });
      cy.task(TaskNames.createCypressTestUser, {
        ...args,
        name: Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE"),
        email: Cypress.env("CYPRESS_TEST_USER_EMAIL_ALTERNATE"),
      }).then((secondCreateTestUserResponse: Response) => {
        console.log("othre user");
        expect(secondCreateTestUserResponse.status).to.equal(201);
      });
    });
  });

  // eslint-disable-next-line no-undef
  after(() => {
    cy.task(TaskNames.disconnectSocket);
  });

  it("joins the matchmaking queue and plays a game", () => {
    const username = Cypress.env("CYPRESS_TEST_USER_NAME");
    // log in so we can play ranked
    cy.request("POST", `http://localhost:8080/api${AuthRoutePaths.ROOT}`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    });
    // log in other user
    cy.task(TaskNames.logUserIn, { email: Cypress.env("CYPRESS_TEST_USER_EMAIL_ALTERNATE"), password: Cypress.env("CYPRESS_TEST_USER_PASSWORD") }).then(() => {
      cy.task(TaskNames.connectSocket);
      cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, data: battleRoomDefaultChatChannel });
    });
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.wait(4000);
    // cy.findByText(new RegExp(username, "i")).should("exist");
    // cy.findByRole("button", { name: /ranked/i }).click();
    // cy.get('[data-cy="game-name-input"]').click().type("{enter}");
    // cy.findByText(/You are the host of game:/i).should("not.exist");
    // cy.findByText(ErrorMessages.LOBBY.GAME_NAME.NOT_ENTERED).should("exist");
    // cy.get('[data-cy="game-name-input"]').click().type(`${mediumTestText}{enter}`);
    // cy.findByText(ErrorMessages.LOBBY.GAME_NAME.MAX_LENGTH).should("exist");
    // cy.get('[data-cy="game-name-input"]').clear().click().type(`${shortTestText}{enter}`);
    // cy.findByText(new RegExp(`You are the host of game: ${shortTestText}`, "i")).should("exist");
    // cy.findByText(/Awaiting challenger.../i).should("exist");
    // cy.findByLabelText("challenger status").find("svg").should("not.exist");
    // // challenger joins game, toggles buttons and leaves
    // cy.task(TaskNames.connectSocket);
    // cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.JOINS_GAME, data: shortTestText.toLowerCase() });
    // cy.findByText(/Awaiting challenger.../i).should("not.exist");
    // cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.CLICKS_READY });
    // cy.findByLabelText("challenger status").find("svg").should("exist");
    // cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.LEAVES_GAME });
    // cy.findByLabelText("challenger status").find("svg").should("not.exist");
    // cy.findByText(/Awaiting challenger.../i).should("exist");
    // // challenger rejoins, all players ready up then challenger disconnects
    // cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.JOINS_GAME, data: shortTestText.toLowerCase() });
    // cy.findByText(/Awaiting challenger.../i).should("not.exist");
    // cy.get('[data-cy="challenger-info"]').findByText(/Anon/i).should("exist");
    // cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.CLICKS_READY });
    // cy.findByLabelText("challenger status").find("svg").should("exist");
    // cy.findByLabelText("host status").find("svg").should("not.exist");
    // cy.findByRole("button", { name: /Ready/i }).click();
    // cy.findByLabelText("host status").find("svg").should("exist");
    // cy.findByText(GameStatus.COUNTING_DOWN).should("exist");
    // cy.task(TaskNames.disconnectSocket);
    // cy.findByText(GameStatus.COUNTING_DOWN).should("not.exist");
    // cy.findByText(GameStatus.IN_LOBBY).should("exist");
    // cy.findByLabelText("challenger status").find("svg").should("not.exist");
    // cy.findByLabelText("host status").find("svg").should("not.exist");
    // // go back to lobby
    // cy.findByRole("button", { name: /Leave Game/i }).click();
    // cy.findByText(new RegExp(`You are the host of game: ${shortTestText}`, "i")).should("not.exist");
    // cy.findByRole("button", { name: /Channel/i }).should("exist");
    // cy.findByRole("button", { name: /Ranked/i }).should("exist");
    // cy.findByRole("button", { name: /Host/i }).should("exist");
    // cy.findByRole("button", { name: /Join/i }).click();
    // cy.get('[data-cy="list-of-current-games"]').findByText(new RegExp(shortTestText, "i")).should("not.exist");
    // cy.findByRole("button", { name: /Back/i }).click();
    // cy.findByRole("button", { name: /Host/i }).click();
    // // host the game again
    // cy.get('[data-cy="game-name-input"]').clear().click().type(`${shortTestText}{enter}`);
    // cy.findByText(new RegExp(`You are the host of game: ${shortTestText}`, "i")).should("exist");
    // cy.findByText(/Awaiting challenger.../i).should("exist");
    // // challenger reconnects, rejoins game and all players ready - game starts
    // cy.task(TaskNames.connectSocket);
    // cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.JOINS_GAME, data: shortTestText.toLowerCase() });
    // cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.CLICKS_READY });
    // cy.findByRole("button", { name: /Ready/i }).click();
    // cy.wait(gameRoomCountdownDuration);
    // cy.get('[data-cy="battle-room-canvas"]').should("exist");
    // // challenger leaves game
    // cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.LEAVES_GAME, data: shortTestText });
    // cy.get('[data-cy="score-screen-modal"]')
    //   .findByText(new RegExp(`Game ${shortTestText} final score:`, "i"))
    //   .should("exist");
    // cy.get('[data-cy="score-screen-modal"]')
    //   .findByText(new RegExp(`${username}:`, "i"))
    //   .should("exist");
    // cy.get('[data-cy="score-screen-modal"]').findByText(/Anon/i).should("exist");
    // cy.findByText(/No changes to ladder rating/i).should("exist");
    // cy.get("body").trigger("keyup", { key: "Escape" });
    // cy.get('[data-cy="score-screen-modal"]').should("not.exist");
  });
});
