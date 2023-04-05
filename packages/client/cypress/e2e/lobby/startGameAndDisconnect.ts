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

  // LOBBY TESTS
  // game setup menu
  //  - pressing button opens menu
  //  - pressing escape closes menu
  //  - clicking back closes menu
  //  - too short name (only empty is considered too short)
  //  - too long name
  //  - duplicate name (other game by same name exists)
  //  - upon clicking create game, button is disabled for a moment until game room info received (might not be easily testible if too fast?)
  //  - upon clicking create game with a valid game name, brings user to game room menu

  // game room menu
  //  - ready button shows loading when pressed
  //  - if challenger leaves game, host sees their spot as empty again
  //  - upon leaving game room menu, user is sent back to their previous chat channel
  //  - upon host leaving game room menu, challenger is sent back to their previous chat channel
  //  - pressing ready button causes player status to change from "not ready" to "ready"
  //  - pressing ready button when player status is "ready" changes it to "not ready"
  //  - can see opponent toggling ready
  //  - when both players are ready a game start countdown is visible
  //  - when game is counting down, unreadying cancels the countdown
  //  - unreadying does not cancel a game that has already started
  //  - if too many games are being played, a waiting list message with position is shown
  //  - game is started after a spot opens up
  // battle room game (casual)
  //  - when a user disconnects from the game, they cede the game to their opponent
  //  - a score screen is shown in the lobby with player names and scores
  //  - score sceen should indicate the game had no effect on ladder ratings or rank
  //  - pressing escape closes the score screen
  // game list menu
  //  - pressing escape closes the game list menu and puts the user back in the main menu
  //  - if no games are being hosted, show a message "no games found"
  //  - pressing the refresh button updates the game list
  //  - full games in the list have their join button disabled
  //  - clicking join on a full game (possible if haven't updated game list) shows "game is full" alert and updates game list
  //  - clicking join on a game with an open spot shows join button loading then places user in game room menu

  // matchmaking queue menu
  //  - clicking ranked when not logged in displays "create an account to play ranked" alert
  //  - clicking ranked while logged in places user in matchmaking queue menu
  //  - matchmaking queue menu displays number of players in queue and current elo diff message
  //  - when a new user joins the queue, the players in queue and elo threshold numbers update
  //  - when a user leaves the queue, the players in queue and elo diff threshold numbers update
  //  - upon finding a match, queue shows match found and game coutdown
  //  - if too many games are being played, a waiting list status is shown
  //  - if a user leaves the matchmaking queue after being matched (during game start countdown), the player they were matched with is placed back in the queue and their previous chat channel
  //  - if a user leaves the matchmaking queue after being matched (during waiting list), the player they were matched with is placed back in the queue and their previous chat channel

  // chat
  //  - users can enter a chat message
  //  - when one user enters a message another user in the same channel can see it
  //  - chat message max length error alert
  //  - chat input delay, short for logged in user, longer for guest
  //  - clicking channel button shows change channel modal
  //  - attempting to join a chat channel prefixed with "game- or ranked-" shows error
  //  - clicking one of the preset channel buttons shows loading then changes channel
  //  - chat channel sidebar shows current chat channel name
  //  - entering a message in the new chat channel is not visible to a user in a different channel
  //  - typing in a too long custom chat channel name shows error message
  //  - user can type in a valid custom channel name and join that channel
  //  - list of users in chat channel sidebar updates when a player leaves or joins the chat channel

  // bans

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
