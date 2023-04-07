import {
  AuthRoutePaths,
  baseGameStartCountdownDuration,
  battleRoomDefaultChatChannel,
  ERROR_MESSAGES,
  FrontendRoutes,
  ONE_SECOND,
  SocketEventsFromClient,
} from "../../../../common";
import { ARIA_LABELS } from "../../../src/consts/aria-labels";
import { BUTTON_NAMES } from "../../../src/consts/button-names";
import { LOBBY_TEXT } from "../../../src/consts/lobby-text";
import { TaskNames } from "../../support/TaskNames";

describe("ladder", () => {
  // eslint-disable-next-line no-undef
  before(() => {
    const args = {
      CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
      CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
    };
    cy.task(TaskNames.setGameStartCountdown, { ...args, gameStartCountdown: baseGameStartCountdownDuration });
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
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.verifyVeiwingMainMenu();

    // check ladder pages loop around correctly
    cy.clickLinkAndVerifyHeading("ladder", "ladder");
    cy.findByLabelText(ARIA_LABELS.LADDER.CURRENT_PAGE).should("contain.text", `${LOBBY_TEXT.LADDER.PAGE_NUMBER_PREFIX}1`);
    cy.findByLabelText(ARIA_LABELS.LADDER.FETCHING_LADDER_ENTRIES).should("not.exist");
    cy.findByLabelText(ARIA_LABELS.LADDER.NEXT_PAGE).click();
    cy.findByLabelText(ARIA_LABELS.LADDER.CURRENT_PAGE).should("contain.text", `${LOBBY_TEXT.LADDER.PAGE_NUMBER_PREFIX}2`);
    cy.findByLabelText(ARIA_LABELS.LADDER.FETCHING_LADDER_ENTRIES).should("not.exist");
    cy.findByLabelText(ARIA_LABELS.LADDER.NEXT_PAGE).click();
    cy.findByLabelText(ARIA_LABELS.LADDER.CURRENT_PAGE).should("contain.text", `${LOBBY_TEXT.LADDER.PAGE_NUMBER_PREFIX}1`);
    cy.findByLabelText(ARIA_LABELS.LADDER.FETCHING_LADDER_ENTRIES).should("not.exist");
    cy.findByLabelText(ARIA_LABELS.LADDER.PREVIOUS_PAGE).click();
    cy.findByLabelText(ARIA_LABELS.LADDER.CURRENT_PAGE).should("contain.text", `${LOBBY_TEXT.LADDER.PAGE_NUMBER_PREFIX}2`);
    // both users should join and leave matchmaking so their score cards are created
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.verifyVeiwingMainMenu();
    cy.task(TaskNames.socketEmit, { username: alternateUsername, event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.task(TaskNames.socketEmit, { username: alternateUsername, event: SocketEventsFromClient.LEAVES_MATCHMAKING_QUEUE });
    cy.clickButton(BUTTON_NAMES.MAIN_MENU.RANKED);
    cy.clickButton(BUTTON_NAMES.MATCHMAKING_QUEUE.CANCEL);
    // find and verify both user's records and elo by flipping through ladder pages
    cy.clickLinkAndVerifyHeading("ladder", "ladder");
    cy.findByLabelText(ARIA_LABELS.LADDER.FETCHING_LADDER_ENTRIES).should("not.exist");
    cy.findByLabelText(ARIA_LABELS.LADDER.PREVIOUS_PAGE).click();
    cy.findByLabelText(ARIA_LABELS.LADDER.CURRENT_PAGE).should("contain.text", `${LOBBY_TEXT.LADDER.PAGE_NUMBER_PREFIX}3`);
    cy.findByLabelText(ARIA_LABELS.LADDER.FETCHING_LADDER_ENTRIES).should("not.exist");
    cy.findByLabelText(ARIA_LABELS.LADDER.PREVIOUS_PAGE).click();
    cy.findByLabelText(ARIA_LABELS.LADDER.CURRENT_PAGE).should("contain.text", `${LOBBY_TEXT.LADDER.PAGE_NUMBER_PREFIX}2`);
    cy.findByText("25").next().should("contain.text", username).next().should("contain.text", "1501");
    cy.findByText("26").next().should("contain.text", alternateUsername).next().should("contain.text", "1500");
    // by searching
    cy.findByLabelText(ARIA_LABELS.LADDER.SEARCH).type("test_user{enter}");
    cy.findByText("25").next().should("contain.text", username).next().should("contain.text", "1501");
    cy.findByLabelText(ARIA_LABELS.LADDER.SEARCH).clear().type("alternate_test_user{enter}");
    cy.findByText("26").next().should("contain.text", alternateUsername).next().should("contain.text", "1500");
    // entering a blank search clears result and displays a full page
    cy.findByLabelText(ARIA_LABELS.LADDER.SEARCH).clear().type("{enter}");
    // cy.get('[data-cy="ladder-table"]').find("tr").should("have.length", 21); // 20 entries per page plus the row headers
    cy.findByLabelText(ARIA_LABELS.LADDER.TABLE).find("tr").should("have.length", 21); // 20 entries per page plus the row headers
    // searching for non existant records gives appropriate response
    cy.findByLabelText(ARIA_LABELS.LADDER.SEARCH).clear().type("non existant name{enter}");
    cy.findByText(ERROR_MESSAGES.LADDER.USER_NOT_FOUND).should("exist");
    // play a game in which one user surrenders so we can quickly get the ranks and elo changed
    cy.findByRole("link", { name: "Game" }).click();
    cy.task(TaskNames.socketEmit, { username: alternateUsername, event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.clickButton(BUTTON_NAMES.MAIN_MENU.RANKED);
    cy.wait(baseGameStartCountdownDuration * ONE_SECOND + ONE_SECOND * 2);
    cy.get('[data-cy="battle-room-canvas"]').should("be.visible");
    cy.task(TaskNames.disconnectSocket, { username: Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE") });
    // check the score screen
    cy.findByLabelText(ARIA_LABELS.SCORE_SCREEN_MODAL).should("be.visible");
    cy.get("body").trigger("keyup", { key: "Escape" });
    // check that ladder has updated
    cy.clickLinkAndVerifyHeading("ladder", "ladder");
    cy.findByLabelText(ARIA_LABELS.LADDER.FETCHING_LADDER_ENTRIES).should("not.exist");
    cy.findByLabelText(ARIA_LABELS.LADDER.NEXT_PAGE).click();
    cy.findByText("24").next().should("contain.text", username).next().should("contain.text", "1517");
    cy.findByText("26").next().should("contain.text", alternateUsername).next().should("contain.text", "1484");
    cy.findByLabelText(ARIA_LABELS.LADDER.SEARCH).clear().type("test_user{enter}");
    cy.findByText("24").next().should("contain.text", username).next().should("contain.text", "1517");
  });
});
