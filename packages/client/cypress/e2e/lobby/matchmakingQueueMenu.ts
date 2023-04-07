import {
  AuthRoutePaths,
  baseGameStartCountdownDuration,
  ErrorMessages,
  FrontendRoutes,
  gameChannelNamePrefix,
  ONE_SECOND,
  rankedGameChannelNamePrefix,
  SocketEventsFromClient,
} from "../../../../common";
import { ARIA_LABELS } from "../../../src/consts/aria-labels";
import { BUTTON_NAMES } from "../../../src/consts/button-names";
import { LOBBY_TEXT } from "../../../src/consts/lobby-text";
import { TaskNames } from "../../support/TaskNames";

export default function matchmakingQueueMenu() {
  const args = {
    CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
    CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
  };
  const testUsers = {};
  const modifiedGameStartCountdown = 3; // give a consistant time for this test, one that is long enough for cypress to read countdown text
  // eslint-disable-next-line no-undef
  before(() => {
    cy.deleteAllTestUsersAndCreateOneTestUser();
    cy.createAndLogInSequentialEloTestUsers(1, 1000, 100, testUsers);
    cy.task(TaskNames.setGameStartCountdown, { ...args, gameStartCountdown: modifiedGameStartCountdown });
  });

  // eslint-disable-next-line no-undef
  after(() => {
    cy.task(TaskNames.setGameStartCountdown, { ...args, gameStartCountdown: baseGameStartCountdownDuration });
  });

  it("correctly displays and provides functionality in the matchmaking queue menu", () => {
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.verifyVeiwingMainMenu();

    // matchmaking queue menu
    //  - clicking ranked when not logged in displays "create an account to play ranked" alert
    cy.clickButton(BUTTON_NAMES.MAIN_MENU.RANKED);
    cy.findByText(ErrorMessages.LOBBY.LOG_IN_TO_PLAY_RANKED).should("be.visible");
    //  - clicking ranked while logged in places user in matchmaking queue menu
    cy.request("POST", `http://localhost:8080/api${AuthRoutePaths.ROOT}`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    }).then((res) => console.log(res));
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.clickButton(BUTTON_NAMES.MAIN_MENU.RANKED);
    cy.findByText(LOBBY_TEXT.MATCHMAKING_QUEUE.SEEKING_RANKED_MATCH).should("be.visible");
    //  - matchmaking queue menu displays number of players in queue and current elo diff message
    cy.findByText(`${LOBBY_TEXT.MATCHMAKING_QUEUE.NUM_PLAYERS_IN_QUEUE}1`).should("be.visible");
    cy.findByText(new RegExp(`${LOBBY_TEXT.MATCHMAKING_QUEUE.ELO_DIFF_THRESHOLD}.*`)).should("be.visible");
    //  - when a new user joins the queue, the players in queue number updates
    cy.task(TaskNames.socketEmit, {
      username: Object.keys(testUsers)[0],
      event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE,
    });
    cy.findByText(`${LOBBY_TEXT.MATCHMAKING_QUEUE.NUM_PLAYERS_IN_QUEUE}2`).should("be.visible");
    //  - when a user leaves the queue, the players in queue number updates
    cy.task(TaskNames.socketEmit, {
      username: Object.keys(testUsers)[0],
      event: SocketEventsFromClient.LEAVES_MATCHMAKING_QUEUE,
    });
    cy.findByText(`${LOBBY_TEXT.MATCHMAKING_QUEUE.NUM_PLAYERS_IN_QUEUE}1`).should("be.visible");
    //  - upon finding a match, queue shows match found and game coutdown
    cy.task(TaskNames.socketEmit, {
      username: Object.keys(testUsers)[0],
      event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE,
    });
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_START_COUNTDOWN).should("be.visible");
    cy.findByText(LOBBY_TEXT.MATCHMAKING_QUEUE.SEEKING_RANKED_MATCH).should("not.exist");
    cy.findByLabelText(ARIA_LABELS.CHAT.CHANNEL_NAME_WITH_NUM_USERS).should("contains", new RegExp(`${gameChannelNamePrefix + rankedGameChannelNamePrefix}.*`));
    //  - if a user leaves the matchmaking queue after being matched (during game start countdown), the player they were matched with is placed back in the queue and their previous chat channel
    cy.task(TaskNames.socketEmit, {
      username: Object.keys(testUsers)[0],
      event: SocketEventsFromClient.LEAVES_GAME,
    });
    cy.findByText(LOBBY_TEXT.MATCHMAKING_QUEUE.SEEKING_RANKED_MATCH).should("be.visible");
    //  - if no user leaves after being matched, they are placed in a game
    cy.task(TaskNames.socketEmit, {
      username: Object.keys(testUsers)[0],
      event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE,
    });
    cy.wait(modifiedGameStartCountdown * ONE_SECOND + ONE_SECOND);
    cy.get(`[data-cy="battle-room-canvas"]`).should("be.visible");
  });
}
