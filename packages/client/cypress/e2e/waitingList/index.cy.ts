import {
  AuthRoutePaths,
  baseGameCreationWaitingListLoopIntervalLength,
  baseMatchmakingQueueIntervalLength,
  baseMaxConcurrentGames,
  battleRoomDefaultChatChannel,
  FrontendRoutes,
  gameOverCountdownDuration,
  baseGameStartCountdownDuration,
  GameStatus,
  ONE_SECOND,
  SocketEventsFromClient,
} from "../../../../common";
import { BUTTON_NAMES } from "../../../src/consts/button-names";
import { LOBBY_TEXT } from "../../../src/consts/lobby-text";
import { shortTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

describe("waiting list", () => {
  const args = {
    CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
    CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
  };
  let testUsers = {};

  // eslint-disable-next-line no-undef
  before(() => {
    // delete all test users (test users are defined in the UsersRepo deleteTestUsers method)
    cy.task(TaskNames.disconnectAllSockets);
    cy.task(TaskNames.deleteAllSocketsAndAccessTokens);
    cy.task(TaskNames.deleteAllTestUsers, args).then((response: Response) => {
      expect(response.status).to.equal(200);
    });
    cy.task(TaskNames.createCypressTestUser, args).then((response: Response) => {
      expect(response.status).to.equal(201);
    });
    cy.task(TaskNames.setMaxConcurrentGames, { ...args, maxConcurrentGames: 1 });
    cy.task(TaskNames.createSequentialEloTestUsers, { ...args, numberToCreate: 5, eloOfFirst: 1000, eloBetweenEach: 100 }).then(
      (response: { data: any; status: number }) => {
        expect(response.status).to.equal(201);
        console.log("created test users in waitingList test: ", response);
        testUsers = response.data;
        Object.entries(testUsers).forEach(([username, user]) => {
          console.log("user: ", user);
          // @ts-ignore
          cy.task(TaskNames.logUserIn, { name: username, email: user.email, password: Cypress.env("CYPRESS_TEST_USER_PASSWORD") }).then(() => {
            cy.task(TaskNames.connectSocket, { username, withHeaders: true }).then(() => {
              cy.task(TaskNames.socketEmit, {
                username,
                event: SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL,
                data: battleRoomDefaultChatChannel,
              });
            });
          });
        });
      }
    );
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
    cy.visitPageAndVerifyHeading(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`, "battle room");

    cy.findByText(new RegExp(Object.keys(testUsers)[0], "i")).should("exist");
    cy.findByText(new RegExp(Object.keys(testUsers)[1], "i")).should("exist");
    cy.task(TaskNames.putTwoSocketsInGameAndStartIt, { username1: Object.keys(testUsers)[0], username2: Object.keys(testUsers)[1], gameName: "game1" });
    cy.task(TaskNames.putTwoSocketClientsInRoomAndHaveBothReadyUp, {
      username1: Object.keys(testUsers)[2],
      username2: Object.keys(testUsers)[3],
      gameName: "game2",
    });
    cy.findByRole("button", { name: /host/i }).click();
    cy.get('[data-cy="game-name-input"]').clear().click().type(`${shortTestText}{enter}`);
    cy.findByText(new RegExp(`You are the host of game: ${shortTestText}`, "i")).should("exist");
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[4], event: SocketEventsFromClient.JOINS_GAME, data: shortTestText.toLowerCase() });
    cy.findByText(/Awaiting challenger.../i).should("not.exist");
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[4], event: SocketEventsFromClient.CLICKS_READY });
    cy.findByLabelText("challenger status").find("svg").should("exist");
    cy.findByRole("button", { name: /Ready/i }).click();
    cy.findByLabelText("host status").find("svg").should("exist");
    cy.findByText(GameStatus.COUNTING_DOWN).should("not.exist");
    cy.findByText(GameStatus.IN_WAITING_LIST).should("exist");
    cy.findByText(new RegExp(`${LOBBY_TEXT.GAME_ROOM.POSITION_IN_WAITING_LIST}2`)).should("exist");
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[4], event: SocketEventsFromClient.CLICKS_READY });
    cy.findByText(new RegExp(GameStatus.IN_LOBBY)).should("exist");
    cy.findByText(new RegExp(GameStatus.IN_WAITING_LIST)).should("not.exist");
    cy.findByText(new RegExp(LOBBY_TEXT.GAME_ROOM.POSITION_IN_WAITING_LIST)).should("not.exist");
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[4], event: SocketEventsFromClient.CLICKS_READY });
    cy.findByText(GameStatus.IN_WAITING_LIST).should("exist");
    cy.findByText(new RegExp(`${LOBBY_TEXT.GAME_ROOM.POSITION_IN_WAITING_LIST}2`)).should("exist");
    cy.task(TaskNames.disconnectSocket, { username: Object.keys(testUsers)[0] });
    cy.findByText(new RegExp(`${LOBBY_TEXT.GAME_ROOM.POSITION_IN_WAITING_LIST}1`), {
      timeout: baseGameCreationWaitingListLoopIntervalLength + gameOverCountdownDuration * ONE_SECOND + ONE_SECOND * 2,
    }).should("exist");
    cy.task(TaskNames.disconnectSocket, { username: Object.keys(testUsers)[2] });
    cy.findByText(GameStatus.COUNTING_DOWN, {
      timeout: baseGameCreationWaitingListLoopIntervalLength + gameOverCountdownDuration * ONE_SECOND + ONE_SECOND * 2,
    }).should("exist");
    cy.get('[data-cy="battle-room-canvas"]', { timeout: baseGameStartCountdownDuration * ONE_SECOND + ONE_SECOND }).should("be.visible");
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
    cy.task(TaskNames.createSequentialEloTestUsers, { ...args, numberToCreate: 5, eloOfFirst: 1000, eloBetweenEach: 100 }).then(
      (response: { data: any; status: number }) => {
        expect(response.status).to.equal(201);
        console.log("created test users in waitingList test: ", response);
        testUsers = response.data;
        Object.entries(testUsers).forEach(([username, user]) => {
          console.log("user: ", user);
          // @ts-ignore
          cy.task(TaskNames.logUserIn, { name: username, email: user.email, password: Cypress.env("CYPRESS_TEST_USER_PASSWORD") }).then(() => {
            cy.task(TaskNames.connectSocket, { username, withHeaders: true }).then(() => {
              cy.task(TaskNames.socketEmit, {
                username,
                event: SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL,
                data: battleRoomDefaultChatChannel,
              });
            });
          });
        });
      }
    );
    cy.request("POST", `http://localhost:8080/api${AuthRoutePaths.ROOT}`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    }).then((res) => console.log(res));
    cy.visitPageAndVerifyHeading(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`, "battle room");

    cy.findAllByText(new RegExp(Object.keys(testUsers)[0], "i")).should("exist");
    cy.findAllByText(new RegExp(Object.keys(testUsers)[1], "i")).should("exist");
    cy.findAllByText(new RegExp(Object.keys(testUsers)[2], "i")).should("exist");
    cy.findAllByText(new RegExp(Object.keys(testUsers)[3], "i")).should("exist");
    cy.findAllByText(new RegExp(Object.keys(testUsers)[4], "i")).should("exist");

    // start one ranked game to reach the limit
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[0], event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[1], event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.wait(baseMatchmakingQueueIntervalLength + ONE_SECOND);
    // have our user and a test user join the matchmaking queue and be matched, this game should be 1st in line
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[2], event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.findByRole("button", { name: /ranked/i }).click();
    cy.findByText(new RegExp(LOBBY_TEXT.MATCHMAKING_QUEUE.RANKED_GAME_STARTING, "i")).should("exist");
    cy.findByText(new RegExp(`${LOBBY_TEXT.GAME_ROOM.POSITION_IN_WAITING_LIST}1`)).should("exist");
    // have another pair be matched, they should be 2nd in line
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[3], event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[4], event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.wait(baseMatchmakingQueueIntervalLength + ONE_SECOND);
    // have the test user paired with our user unready, it should place us back in the queue and not show the waiting list text
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[2], event: SocketEventsFromClient.CLICKS_READY });
    cy.findByText(new RegExp(LOBBY_TEXT.MATCHMAKING_QUEUE.RANKED_GAME_STARTING, "i")).should("not.exist");
    cy.findByText(new RegExp(`${LOBBY_TEXT.GAME_ROOM.POSITION_IN_WAITING_LIST}1`)).should("not.exist");
    cy.findByText(new RegExp(`${LOBBY_TEXT.MATCHMAKING_QUEUE.SEEKING_RANKED_MATCH}`)).should("exist");
    // have the test user rejoin the queue, it should place us in a game and show us now 2nd in line
    cy.task(TaskNames.socketEmit, { username: Object.keys(testUsers)[2], event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.findByText(new RegExp(LOBBY_TEXT.MATCHMAKING_QUEUE.RANKED_GAME_STARTING, "i")).should("exist");
    cy.findByText(new RegExp(`${LOBBY_TEXT.GAME_ROOM.POSITION_IN_WAITING_LIST}2`)).should("exist");
    // have us unready, it should put us in battle-room-chat and remove us from the queue
    cy.findByRole("button", { name: new RegExp(BUTTON_NAMES.GAME_ROOM.LEAVE_WAITING_LIST, "i") }).click();
    cy.findByText(new RegExp(LOBBY_TEXT.MATCHMAKING_QUEUE.RANKED_GAME_STARTING, "i")).should("not.exist");
    cy.findByText(new RegExp(`${LOBBY_TEXT.GAME_ROOM.POSITION_IN_WAITING_LIST}1`)).should("not.exist");
    cy.findByText(new RegExp(`${LOBBY_TEXT.MATCHMAKING_QUEUE.SEEKING_RANKED_MATCH}`)).should("not.be.visible");
    cy.findByLabelText("chat channel name and number of users").findByText(new RegExp(battleRoomDefaultChatChannel, "i")).should("exist");
    // rejoin the queue, it should match us and still be 2nd in line
    cy.findByRole("button", { name: /ranked/i }).click();
    cy.findByText(new RegExp(LOBBY_TEXT.MATCHMAKING_QUEUE.RANKED_GAME_STARTING, "i")).should("exist");
    cy.findByText(new RegExp(`${LOBBY_TEXT.GAME_ROOM.POSITION_IN_WAITING_LIST}2`)).should("exist");
    // end the 1st game, we should now be 1st in line,
    cy.task(TaskNames.disconnectSocket, { username: Object.keys(testUsers)[0] });
    cy.findByText(new RegExp(`${LOBBY_TEXT.GAME_ROOM.POSITION_IN_WAITING_LIST}1`), {
      timeout: baseGameCreationWaitingListLoopIntervalLength + gameOverCountdownDuration * ONE_SECOND + ONE_SECOND * 2,
    }).should("exist");
    // end the 2nd game, our game should start
    cy.task(TaskNames.disconnectSocket, { username: Object.keys(testUsers)[3] });
    cy.findByText(GameStatus.COUNTING_DOWN, {
      timeout: baseGameCreationWaitingListLoopIntervalLength + gameOverCountdownDuration * ONE_SECOND + ONE_SECOND * 2,
    }).should("exist");
  });
});
