import {
  AuthRoutePaths,
  baseGameCreationWaitingListLoopIntervalLength,
  baseMatchmakingQueueIntervalLength,
  baseMaxConcurrentGames,
  battleRoomDefaultChatChannel,
  FrontendRoutes,
  gameOverCountdownDuration,
  baseGameStartCountdownDuration,
  ONE_SECOND,
  SocketEventsFromClient,
} from "../../../../common";
import { ARIA_LABELS } from "../../../src/consts/aria-labels";
import { BUTTON_NAMES } from "../../../src/consts/button-names";
import { APP_TEXT } from "../../../src/consts/app-text";
import { shortTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

describe("waiting list", () => {
  const args = {
    CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
    CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
  };
  const testUsers = {};

  // eslint-disable-next-line no-undef
  before(() => {
    // delete all test users (test users are defined in the UsersRepo deleteTestUsers method)
    cy.task(TaskNames.setGameStartCountdown, { ...args, gameStartCountdown: baseGameStartCountdownDuration });
    cy.task(TaskNames.disconnectAllSockets);
    cy.task(TaskNames.deleteAllSocketsAndAccessTokens);
    cy.task(TaskNames.deleteAllTestUsers, args).then((response: Response) => {
      expect(response.status).to.equal(200);
    });
    cy.task(TaskNames.createCypressTestUser, args).then((response: Response) => {
      expect(response.status).to.equal(201);
    });
    cy.task(TaskNames.setMaxConcurrentGames, { ...args, maxConcurrentGames: 1 });
    cy.createAndLogInSequentialEloTestUsers(5, 1000, 100, testUsers);
  });

  // eslint-disable-next-line no-undef
  after(() => {
    cy.task(TaskNames.setMaxConcurrentGames, { ...args, maxConcurrentGames: baseMaxConcurrentGames });
  });

  it("when placed in waiting list from a casual game, shows waiting list position, updates the position", () => {
    cy.request("POST", `http://localhost:8080/api${AuthRoutePaths.ROOT}`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    }).then((res) => console.log(res));
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.verifyVeiwingMainMenu();
    // have one game start and another try to start but be placed in the waiting list
    cy.task(TaskNames.putTwoSocketsInGameAndStartIt, { username1: Object.keys(testUsers)[0], username2: Object.keys(testUsers)[1], gameName: "game1" });
    cy.task(TaskNames.putTwoSocketClientsInRoomAndHaveBothReadyUp, {
      username1: Object.keys(testUsers)[2],
      username2: Object.keys(testUsers)[3],
      gameName: "game2",
    });
    // cypress user attempt to start a game and be placed in the list behind the 2nd game started above
    cy.clickButton(BUTTON_NAMES.MAIN_MENU.HOST);
    cy.findByLabelText(APP_TEXT.GAME_SETUP.GAME_CREATION_INPUT_LABEL).focus().clear().type(`${shortTestText}{enter}`);
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[4], event: SocketEventsFromClient.JOINS_GAME, data: shortTestText.toLowerCase() });
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[4], event: SocketEventsFromClient.CLICKS_READY });
    cy.clickButton(BUTTON_NAMES.GAME_ROOM.READY);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("not.contain.text", APP_TEXT.GAME_ROOM.GAME_STATUS.GAME_STARTING);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("contain.text", APP_TEXT.GAME_ROOM.GAME_STATUS.IN_WAITING_LIST);
    cy.findByText(APP_TEXT.GAME_ROOM.GAME_STATUS.IN_WAITING_LIST).should("be.visible");
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.WAITING_LIST_POSITION, {
      timeout: baseGameCreationWaitingListLoopIntervalLength + gameOverCountdownDuration * ONE_SECOND + ONE_SECOND * 2,
    }).should("contain.text", "2");
    // a player unreadying should take this game out of the waiting list
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[4], event: SocketEventsFromClient.CLICKS_READY });
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("contain.text", APP_TEXT.GAME_ROOM.GAME_STATUS.WAITING_FOR_PLAYERS_TO_BE_READY);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("not.contain.text", APP_TEXT.GAME_ROOM.GAME_STATUS.IN_WAITING_LIST);
    cy.findByText(new RegExp(APP_TEXT.GAME_ROOM.GAME_STATUS.IN_WAITING_LIST)).should("not.exist");
    // readying up again should place this game back in the list
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[4], event: SocketEventsFromClient.CLICKS_READY });
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("contain.text", APP_TEXT.GAME_ROOM.GAME_STATUS.IN_WAITING_LIST);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.WAITING_LIST_POSITION, {
      timeout: baseGameCreationWaitingListLoopIntervalLength + gameOverCountdownDuration * ONE_SECOND + ONE_SECOND * 2,
    }).should("contain.text", "2");
    // ending the first game (game in progress) should start the 2nd game (1st in waiting list) and bump up cypress user's game to 1st position
    cy.task(TaskNames.disconnectSocket, { username: Object.keys(testUsers)[0] });
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.WAITING_LIST_POSITION, {
      timeout: baseGameCreationWaitingListLoopIntervalLength + gameOverCountdownDuration * ONE_SECOND + ONE_SECOND * 2,
    }).should("contain.text", "1");
    // ending the only game now in progress should open up the slot for cypress user's game to start
    cy.task(TaskNames.disconnectSocket, { username: Object.keys(testUsers)[2] });
    cy.findByText(APP_TEXT.GAME_ROOM.GAME_STATUS.GAME_STARTING, {
      timeout: baseGameCreationWaitingListLoopIntervalLength + gameOverCountdownDuration * ONE_SECOND + ONE_SECOND * 2,
    }).should("exist");
    cy.get('[data-cy="battle-room-canvas"]').should("be.visible");
  });

  it("when placed in waiting list from the matchmaking queue, shows waiting list position, updates the position", () => {
    cy.task(TaskNames.disconnectAllSockets);
    cy.task(TaskNames.deleteAllSocketsAndAccessTokens);
    // delete all test users (test users are defined in the UsersRepo deleteTestUsers method)
    cy.task(TaskNames.deleteAllTestUsers, args).then((response: Response) => {
      expect(response.status).to.equal(200);
    });
    cy.task(TaskNames.createCypressTestUser, args).then((response: Response) => {
      expect(response.status).to.equal(201);
    });
    cy.task(TaskNames.setMaxConcurrentGames, { ...args, maxConcurrentGames: 1 });
    cy.createAndLogInSequentialEloTestUsers(5, 1000, 100, testUsers);

    cy.request("POST", `http://localhost:8080/api${AuthRoutePaths.ROOT}`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    }).then((res) => console.log(res));
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.verifyVeiwingMainMenu();

    // start one ranked game to reach the limit
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[0], event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[1], event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.wait(baseMatchmakingQueueIntervalLength + ONE_SECOND);
    // have our user and a test user join the matchmaking queue and be matched, this game should be 1st in line
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[2], event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.clickButton(BUTTON_NAMES.MAIN_MENU.RANKED);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("contain.text", APP_TEXT.GAME_ROOM.GAME_STATUS.IN_WAITING_LIST);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.WAITING_LIST_POSITION).should("contain.text", "1");
    // have another pair be matched, they should be 2nd in line
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[3], event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[4], event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.wait(baseMatchmakingQueueIntervalLength + baseGameStartCountdownDuration * ONE_SECOND);
    // have the test user paired with our user unready, it should place us back in the queue and not show the waiting list text
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[2], event: SocketEventsFromClient.CLICKS_READY });
    cy.findByText(APP_TEXT.MATCHMAKING_QUEUE.SEEKING_RANKED_MATCH).should("be.visible");
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("not.exist");
    // have the test user rejoin the queue, it should place us in a game room and show us now 2nd in line
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[2], event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("contain.text", APP_TEXT.GAME_ROOM.GAME_STATUS.IN_WAITING_LIST);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.WAITING_LIST_POSITION).should("contain.text", "2");
    // have us unready, it should put us in battle-room-chat and remove us from the queue (sent back to main menu)
    cy.clickButton(BUTTON_NAMES.GAME_ROOM.LEAVE_GAME);
    cy.verifyVeiwingMainMenu();
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("not.exist");
    cy.findByText(APP_TEXT.MATCHMAKING_QUEUE.SEEKING_RANKED_MATCH).should("not.exist");
    cy.findByLabelText(ARIA_LABELS.CHAT.CHANNEL_NAME_WITH_NUM_USERS).findByText(new RegExp(battleRoomDefaultChatChannel, "i")).should("exist");
    // rejoin the queue, it should match us and still be 2nd in line
    cy.clickButton(BUTTON_NAMES.MAIN_MENU.RANKED);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("contain.text", APP_TEXT.GAME_ROOM.GAME_STATUS.IN_WAITING_LIST);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.WAITING_LIST_POSITION).should("contain.text", "2");
    // end the 1st game, we should now be 1st in line,
    cy.task(TaskNames.disconnectSocket, { username: Object.keys(testUsers)[0] });
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.WAITING_LIST_POSITION, {
      timeout: baseGameCreationWaitingListLoopIntervalLength + gameOverCountdownDuration * ONE_SECOND + ONE_SECOND * 2,
    }).should("contain.text", "1");
    // end the 2nd game, our game should start
    cy.task(TaskNames.disconnectSocket, { username: Object.keys(testUsers)[3] });
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("contain.text", APP_TEXT.GAME_ROOM.GAME_STATUS.GAME_STARTING);
  });
});
