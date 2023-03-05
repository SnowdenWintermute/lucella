import {
  AuthRoutePaths,
  baseGameCreationWaitingListLoopInterval,
  baseMaxConcurrentGames,
  battleRoomDefaultChatChannel,
  FrontendRoutes,
  gameOverCountdownDuration,
  gameRoomCountdownDuration,
  GameStatus,
  ONE_SECOND,
  SocketEventsFromClient,
} from "../../../../common";
import { LOBBY_TEXT } from "../../../src/consts/lobby-text";
import { shortTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

export default function waitingListInMatchmaking() {
  const args = {
    CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
    CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
  };
  let testUsers = {};

  // eslint-disable-next-line no-undef
  before(() => {
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
  });

  // eslint-disable-next-line no-undef
  after(() => {
    cy.task(TaskNames.setMaxConcurrentGames, { ...args, maxConcurrentGames: baseMaxConcurrentGames });
  });

  it("shows waiting list position, updates the position", () => {
    cy.request("POST", `http://localhost:8080/api${AuthRoutePaths.ROOT}`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    }).then((res) => console.log(res));
    cy.visitPageAndVerifyHeading(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`, "battle room");

    cy.findByText(new RegExp(Object.keys(testUsers)[0], "i")).should("exist");
    cy.findByText(new RegExp(Object.keys(testUsers)[1], "i")).should("exist");
    cy.findByText(new RegExp(Object.keys(testUsers)[2], "i")).should("exist");
    cy.findByText(new RegExp(Object.keys(testUsers)[3], "i")).should("exist");
    cy.findByText(new RegExp(Object.keys(testUsers)[4], "i")).should("exist");

    // start one ranked game to reach the limit
    // have our user and a test user join the matchmaking queue and be matched, this game should be 1st in line
    // have another pair be matched, they should be 2nd in line
    // have the test user paired with our user unready, it should place us back in the queue and not show the waiting list text
    // have the test user rejoin the queue, it should place us in a game and show us now 2nd in line
    // have us unready, it should put us in battle-room-chat and remove us from the queue
    // rejoin the queue, it should match us and still be 2nd in line
    // end the 1st game, we should now be 1st in line,
    // end the 2nd game, our game should start
  });
}
