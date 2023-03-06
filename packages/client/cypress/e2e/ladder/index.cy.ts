import {
  AuthRoutePaths,
  battleRoomDefaultChatChannel,
  ErrorMessages,
  FrontendRoutes,
  gameRoomCountdownDuration,
  ONE_SECOND,
  rankedGameChannelNamePrefix,
  SocketEventsFromClient,
} from "../../../../common";
import { LOBBY_TEXT } from "../../../src/consts/lobby-text";
import { TaskNames } from "../../support/TaskNames";

describe("ladder", () => {
  // eslint-disable-next-line no-undef
  before(() => {
    const args = {
      CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
      CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
    };
    // delete all test users (test users are defined in the UsersRepo deleteTestUsers method)
    cy.task(TaskNames.deleteAllTestUsers, { ...args }).then((response: Response) => {
      expect(response.status).to.equal(200);
      cy.task(TaskNames.createCypressTestUser, { ...args, elo: 1501 }).then((firstCreateTestUserResponse: Response) => {
        expect(firstCreateTestUserResponse.status).to.equal(201);
      });
      cy.task(TaskNames.createCypressTestUser, {
        ...args,
        name: Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE"),
        email: Cypress.env("CYPRESS_TEST_USER_EMAIL_ALTERNATE"),
      }).then((secondCreateTestUserResponse: Response) => {
        expect(secondCreateTestUserResponse.status).to.equal(201);
      });
      // create 39 users, with our ladder page size of 40 and the fact that we create the test_user's score card it should perfectly
      // make two pages, and create a third once the alternate test user's score card is created
      cy.task(TaskNames.createSequentialEloTestUsers, { ...args, numberToCreate: 39, eloOfFirst: 15, eloBetweenEach: 100 });
    });
  });

  afterEach(() => {
    cy.task(TaskNames.disconnectSocket, { username: Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE") });
  });
  beforeEach(() => {
    cy.task(TaskNames.disconnectSocket, { username: Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE") });
  });

  it(`finds own rank and opponent rank via page and search, then plays a game and sees updated results in
        score screen, ladder pages and search`, () => {
    const username = Cypress.env("CYPRESS_TEST_USER_NAME");
    const alternateUsername = Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE");
    // log in so we can play ranked
    cy.request("POST", `http://localhost:8080/api${AuthRoutePaths.ROOT}`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    });
    // log in other user
    cy.task(TaskNames.logUserIn, {
      name: alternateUsername,
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL_ALTERNATE"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    }).then(() => {
      cy.task(TaskNames.connectSocket, { username: alternateUsername, withHeaders: true });
      cy.task(TaskNames.socketEmit, {
        username: alternateUsername,
        event: SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL,
        data: battleRoomDefaultChatChannel,
      });
    });
    // check ladder pages loop around correctly
    cy.visitPageAndVerifyHeading(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`, "battle room");
    cy.findByText(alternateUsername).should("be.visible");
    cy.clickLinkAndVerifyHeading("ladder", "ladder");
    cy.get('[data-cy="ladder-current-page"]').findByText("1").should("exist");
    cy.get('[data-cy="loading-data').should("not.exist");
    cy.get('[data-cy="ladder-page-forward"]').click({ force: true });
    cy.get('[data-cy="ladder-current-page"]').findByText("2").should("exist");
    cy.get('[data-cy="loading-data').should("not.exist");
    cy.get('[data-cy="ladder-page-forward"]').click({ force: true });
    cy.get('[data-cy="ladder-current-page"]').findByText("1").should("exist");
    cy.get('[data-cy="loading-data').should("not.exist");
    cy.get('[data-cy="ladder-page-back"]').click({ force: true });
    cy.get('[data-cy="ladder-current-page"]').findByText("2").should("exist");
    // both users should join and leave matchmaking so their score cards are created
    cy.clickLinkAndVerifyHeading("game", "battle room");
    cy.task(TaskNames.socketEmit, { username: alternateUsername, event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.task(TaskNames.socketEmit, { username: alternateUsername, event: SocketEventsFromClient.LEAVES_MATCHMAKING_QUEUE });
    cy.findByRole("button", { name: /ranked/i }).click();
    cy.findByRole("button", { name: /cancel search/i }).click();
    // find and verify both user's records and elo by flipping through ladder pages
    cy.clickLinkAndVerifyHeading("ladder", "ladder");
    cy.get('[data-cy="loading-data').should("not.exist");
    cy.get('[data-cy="ladder-page-back"]').click({ force: true });
    cy.get('[data-cy="ladder-current-page"]').findByText("3").should("exist");
    cy.get('[data-cy="loading-data').should("not.exist");
    cy.get('[data-cy="ladder-page-back"]').click({ force: true });
    cy.get('[data-cy="ladder-current-page"]').findByText("2").should("exist");
    cy.findByText("25").next().should("contain.text", username).next().should("contain.text", "1501");
    cy.findByText("26").next().should("contain.text", alternateUsername).next().should("contain.text", "1500");
    // by searching
    cy.findByLabelText("ladder search").type("test_user{enter}");
    cy.findByText("25").next().should("contain.text", username).next().should("contain.text", "1501");
    cy.findByLabelText("ladder search").clear().type("alternate_test_user{enter}");
    cy.findByText("26").next().should("contain.text", alternateUsername).next().should("contain.text", "1500");
    // test clearing search and searching for non existant records
    cy.findByLabelText("ladder search").clear().type("{enter}");
    cy.get('[data-cy="ladder-table"]').find("tr").should("have.length", 21); // 20 entries per page plus the row headers
    cy.findByLabelText("ladder search").clear().type("non existant name{enter}");
    cy.findByText(ErrorMessages.LADDER.USER_NOT_FOUND).should("exist");
    // play a game in which one user surrenders so we can quickly get the ranks and elo changed
    cy.clickLinkAndVerifyHeading("game", "battle room");
    cy.findByText(username).should("be.visible");
    cy.findByText(alternateUsername).should("be.visible");
    cy.task(TaskNames.socketEmit, { username: alternateUsername, event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.findByRole("button", { name: /ranked/i }).click();
    cy.findByText(new RegExp(LOBBY_TEXT.MATCHMAKING_QUEUE.SEEKING_RANKED_MATCH, "i")).should("be.visible");
    cy.get('[data-cy="battle-room-canvas"]').should("be.visible");
    cy.task(TaskNames.disconnectSocket, { username: Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE") });
    // check the score screen
    cy.get('[data-cy="score-screen-modal"]')
      .findByText(new RegExp(`Game ${rankedGameChannelNamePrefix}\\d+ final score:`, "i"))
      .should("exist");
    cy.get('[data-cy="score-screen-modal"]')
      .contains(new RegExp(`${username}:`, "i"))
      .should("be.visible");
    cy.get('[data-cy="score-screen-modal"]')
      .contains(new RegExp(`${alternateUsername}:`, "i"))
      .should("be.visible");
    cy.findByText(/elo:/i).next().should("contain.text", "1517");
    cy.findByText(/rank:/i).next().should("contain.text", "25 -> 24");
    // check that ladder has updated
    cy.get("body").trigger("keyup", { key: "Escape" });
    cy.clickLinkAndVerifyHeading("ladder", "ladder");
    cy.get('[data-cy="loading-data').should("not.exist");
    cy.get('[data-cy="ladder-page-forward"]').click({ force: true });
    cy.findByText("24").next().should("contain.text", username).next().should("contain.text", "1517");
    cy.findByText("26").next().should("contain.text", alternateUsername).next().should("contain.text", "1484");
    cy.findByLabelText("ladder search").type("test_user{enter}");
    cy.findByText("24").next().should("contain.text", username).next().should("contain.text", "1517");
    cy.findByLabelText("ladder search").clear().type("alternate_test_user{enter}");
    cy.findByText("26").next().should("contain.text", alternateUsername).next().should("contain.text", "1484");
    cy.task(TaskNames.disconnectSocket, { username: Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE") });
  });
});
