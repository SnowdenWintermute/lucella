import {
  battleRoomDefaultChatChannel,
  FrontendRoutes,
  gameChannelNamePrefix,
  gameOverCountdownDuration,
  baseGameStartCountdownDuration,
  ONE_SECOND,
  PlayerRole,
  SocketEventsFromClient,
} from "../../../../common";
import { BUTTON_NAMES } from "../../../src/consts/button-names";
import { LOBBY_TEXT } from "../../../src/consts/lobby-text";
import { ARIA_LABELS } from "../../../src/consts/aria-labels";
import { shortTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

export default function gameRoomMenu() {
  // eslint-disable-next-line no-undef
  before(() => {
    cy.deleteAllTestUsersAndCreateOneTestUser();
  });

  it("provides the functionality of the game room menu", () => {
    const arbitraryNameForAnonUserInCypressSocketList = "Anon1234";
    cy.task(TaskNames.connectSocket, { username: arbitraryNameForAnonUserInCypressSocketList });
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.verifyVeiwingMainMenu();

    //  - upon leaving game room menu, user is sent back to their previous chat channel
    cy.findByLabelText(ARIA_LABELS.CHAT.CHANNEL_NAME_WITH_NUM_USERS).should("contain.text", battleRoomDefaultChatChannel);
    cy.hostCasualGame(shortTestText);
    cy.findByLabelText(ARIA_LABELS.CHAT.CHANNEL_NAME_WITH_NUM_USERS).should("contain.text", gameChannelNamePrefix + shortTestText.toLowerCase());
    cy.clickButton(BUTTON_NAMES.GAME_ROOM.LEAVE_GAME);
    cy.findByLabelText(ARIA_LABELS.CHAT.CHANNEL_NAME_WITH_NUM_USERS).should("contain.text", battleRoomDefaultChatChannel);
    //  - challenger name should show empty when no 2nd player is in game
    cy.hostCasualGame(shortTestText);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.PLAYER_NAME(PlayerRole.CHALLENGER)).should("contain.text", "...");
    //  - challenger name should appear when they join
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.JOINS_GAME,
      data: shortTestText,
    });
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.PLAYER_NAME(PlayerRole.CHALLENGER)).should("contains", /.*anon.*/i);
    //  - if challenger leaves game, host sees their spot as empty again
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.LEAVES_GAME,
    });
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.PLAYER_NAME(PlayerRole.CHALLENGER)).should("contain.text", "...");
    //  - pressing ready button toggles ready status
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.PLAYER_READY_STATUS(PlayerRole.HOST)).should("contain.text", LOBBY_TEXT.GAME_ROOM.PLAYER_READY_STATUS.NOT_READY);
    cy.clickButton(BUTTON_NAMES.GAME_ROOM.READY);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.PLAYER_READY_STATUS(PlayerRole.HOST)).should("contain.text", LOBBY_TEXT.GAME_ROOM.PLAYER_READY_STATUS.READY);
    cy.clickButton(BUTTON_NAMES.GAME_ROOM.READY);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.PLAYER_READY_STATUS(PlayerRole.HOST)).should("contain.text", LOBBY_TEXT.GAME_ROOM.PLAYER_READY_STATUS.NOT_READY);
    //  - can see opponent toggling ready
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.JOINS_GAME,
      data: shortTestText,
    });
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.PLAYER_READY_STATUS(PlayerRole.CHALLENGER)).should(
      "contain.text",
      LOBBY_TEXT.GAME_ROOM.PLAYER_READY_STATUS.NOT_READY
    );
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.CLICKS_READY,
    });
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.PLAYER_READY_STATUS(PlayerRole.CHALLENGER)).should("contain.text", LOBBY_TEXT.GAME_ROOM.PLAYER_READY_STATUS.READY);
    //  - when both players are ready a game start countdown is visible
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("contain.text", LOBBY_TEXT.GAME_ROOM.GAME_STATUS.WAITING_FOR_PLAYERS_TO_BE_READY);
    cy.clickButton(BUTTON_NAMES.GAME_ROOM.READY);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.PLAYER_READY_STATUS(PlayerRole.HOST)).should("contain.text", LOBBY_TEXT.GAME_ROOM.PLAYER_READY_STATUS.READY);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.PLAYER_READY_STATUS(PlayerRole.CHALLENGER)).should("contain.text", LOBBY_TEXT.GAME_ROOM.PLAYER_READY_STATUS.READY);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("contain.text", LOBBY_TEXT.GAME_ROOM.GAME_STATUS.GAME_STARTING);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_START_COUNTDOWN).should("be.visible");
    //  - when game is counting down, unreadying cancels the countdown
    cy.clickButton(BUTTON_NAMES.GAME_ROOM.READY);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("not.contain.text", LOBBY_TEXT.GAME_ROOM.GAME_STATUS.GAME_STARTING);
    cy.findByLabelText(ARIA_LABELS.GAME_ROOM.GAME_STATUS).should("contain.text", LOBBY_TEXT.GAME_ROOM.GAME_STATUS.WAITING_FOR_PLAYERS_TO_BE_READY);
    //  - game is started after a spot opens up
    cy.clickButton(BUTTON_NAMES.GAME_ROOM.READY);
    cy.wait(baseGameStartCountdownDuration * ONE_SECOND + ONE_SECOND);
    cy.get(`[data-cy="battle-room-canvas"]`).should("be.visible");
    //  - upon host leaving game room menu, challenger is sent back to their previous chat channel
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.wait(gameOverCountdownDuration * ONE_SECOND + ONE_SECOND * 2);
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.HOSTS_NEW_GAME,
      data: shortTestText,
    });
    cy.openAndVerifyMenu(BUTTON_NAMES.MAIN_MENU.JOIN, LOBBY_TEXT.GAME_LIST.TITLE);
    cy.findByLabelText(ARIA_LABELS.GAME_LIST.REFRESH_GAME_LIST).click();
    cy.findByLabelText(ARIA_LABELS.GAME_LIST.JOIN_GAME_BY_NAME_OF(shortTestText)).click();
    cy.findByLabelText(ARIA_LABELS.CHAT.CHANNEL_NAME_WITH_NUM_USERS).should("contain.text", gameChannelNamePrefix + shortTestText.toLowerCase());
    cy.task(TaskNames.socketEmit, {
      username: arbitraryNameForAnonUserInCypressSocketList,
      event: SocketEventsFromClient.LEAVES_GAME,
    });
    cy.findByLabelText(ARIA_LABELS.CHAT.CHANNEL_NAME_WITH_NUM_USERS).should("contain.text", battleRoomDefaultChatChannel);
  });
}
