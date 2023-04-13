import {
  SocketEventsFromClient,
  battleRoomDefaultChatChannel,
  FrontendRoutes,
  chatChannelWelcomeMessage,
  ChatMessage,
  ERROR_MESSAGES,
  chatMessageMaxLength,
  rankedGameChannelNamePrefix,
  gameChannelNamePrefix,
  defaultChatChannelNames,
  chatChannelNameMaxLength,
} from "../../../../common";
import { ARIA_LABELS } from "../../../src/consts/aria-labels";
import { BUTTON_NAMES } from "../../../src/consts/button-names";
import { APP_TEXT } from "../../../src/consts/app-text";
import { mediumTestText, shortTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

export default function chat() {
  const args = {
    CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
    CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
  };
  return it("provides all functionality for the chat interface", () => {
    const username = Cypress.env("CYPRESS_TEST_USER_NAME");
    const email = Cypress.env("CYPRESS_TEST_USER_EMAIL");

    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    //  - users receive a welcome message when joining a channel
    cy.findByText(chatChannelWelcomeMessage(battleRoomDefaultChatChannel), { timeout: 15000 }).should("be.visible");
    //  - users can enter a chat message
    cy.findByLabelText(ARIA_LABELS.CHAT.INPUT).focus().type(`${shortTestText}{enter}`);
    cy.findByText(shortTestText).should("be.visible");
    //  - list of users in chat channel sidebar updates when a player leaves, disconnects or joins the chat channel
    cy.task(TaskNames.createCypressTestUser, { ...args, username, email });
    cy.task(TaskNames.logUserIn, { name: username, email, password: Cypress.env("CYPRESS_TEST_USER_PASSWORD") });
    cy.task(TaskNames.connectSocket, { username, withHeaders: true });
    cy.findByLabelText(ARIA_LABELS.CHAT.LIST_OF_USERS_IN_CHANNEL).should("not.contain.text", username);
    cy.task(TaskNames.socketEmit, {
      username,
      event: SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL,
      data: battleRoomDefaultChatChannel,
    });
    cy.findByLabelText(ARIA_LABELS.CHAT.LIST_OF_USERS_IN_CHANNEL).should("contain.text", username);
    cy.task(TaskNames.disconnectSocket, { username });
    cy.findByLabelText(ARIA_LABELS.CHAT.LIST_OF_USERS_IN_CHANNEL).should("not.contain.text", username);
    cy.task(TaskNames.connectSocket, { username, withHeaders: true });
    cy.task(TaskNames.socketEmit, {
      username,
      event: SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL,
      data: battleRoomDefaultChatChannel,
    });
    cy.findByLabelText(ARIA_LABELS.CHAT.LIST_OF_USERS_IN_CHANNEL).should("contain.text", username);
    cy.task(TaskNames.socketEmit, {
      username,
      event: SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL,
      data: "a",
    });
    cy.findByLabelText(ARIA_LABELS.CHAT.LIST_OF_USERS_IN_CHANNEL).should("not.contain.text", username);
    cy.task(TaskNames.socketEmit, {
      username,
      event: SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL,
      data: battleRoomDefaultChatChannel,
    });
    cy.findByLabelText(ARIA_LABELS.CHAT.LIST_OF_USERS_IN_CHANNEL).should("contain.text", username);
    //  - when one user enters a message another user in the same channel can see it
    cy.task(TaskNames.socketEmit, {
      username,
      event: SocketEventsFromClient.NEW_CHAT_MESSAGE,
      data: new ChatMessage(mediumTestText),
    });
    cy.findByLabelText(ARIA_LABELS.CHAT.MESSAGE_STREAM).should("contain.text", username + APP_TEXT.CHAT.AUTHOR_MESSAGE_DELIMITER + mediumTestText);
    //  - chat message max length error alert
    const oneMoreThanMaximumLengthMessage = [];
    for (let i = chatMessageMaxLength + 1; i > 0; i -= 1) oneMoreThanMaximumLengthMessage.push("a");
    const longText = oneMoreThanMaximumLengthMessage.join("");
    cy.findByLabelText(ARIA_LABELS.CHAT.INPUT).focus().type(`${longText}`);
    cy.findByText(ERROR_MESSAGES.LOBBY.CHAT.MESSAGE_TOO_LONG).should("be.visible");
    //  - chat input delay
    cy.findByLabelText(ARIA_LABELS.CHAT.INPUT).focus().clear().type("a{enter}");
    cy.findByLabelText(ARIA_LABELS.CHAT.MESSAGE_STREAM).should("contain.text", `${APP_TEXT.CHAT.AUTHOR_MESSAGE_DELIMITER}a`);
    cy.findByLabelText(ARIA_LABELS.CHAT.INPUT).focus().clear().type("b{enter}");
    cy.findByLabelText(ARIA_LABELS.CHAT.INPUT_DELAY_INDICATOR).should("be.visible");
    cy.findByLabelText(ARIA_LABELS.CHAT.MESSAGE_STREAM).should("contain.text", `${APP_TEXT.CHAT.AUTHOR_MESSAGE_DELIMITER}a`);
    cy.findByLabelText(ARIA_LABELS.CHAT.INPUT_DELAY_INDICATOR).should("not.exist");
    cy.findByLabelText(ARIA_LABELS.CHAT.MESSAGE_STREAM).should("contain.text", `${APP_TEXT.CHAT.AUTHOR_MESSAGE_DELIMITER}b`);
    //  - clicking channel button shows change channel modal
    cy.clickButton(BUTTON_NAMES.MAIN_MENU.CHANNEL);
    cy.findByLabelText(ARIA_LABELS.MAIN_MENU.CHANGE_CHANNEL_MODAL).should("be.visible");
    //  - attempting to join a chat channel prefixed with "game- or ranked-" shows error
    cy.findByLabelText(APP_TEXT.MAIN_MENU.CHANNEL_MODAL_INPUT_LABEL)
      .click({ force: true })
      .clear({ force: true })
      .type(`${rankedGameChannelNamePrefix}{enter}`, { force: true });
    cy.clickButton(BUTTON_NAMES.MAIN_MENU.CHANNEL);
    cy.findByLabelText(ARIA_LABELS.MAIN_MENU.CHANGE_CHANNEL_MODAL).should("be.visible");
    cy.findByLabelText(ARIA_LABELS.MAIN_MENU.CHANGE_CHANNEL_MODAL_INPUT)
      .click({ force: true })
      .clear({ force: true })
      .type(`${rankedGameChannelNamePrefix}{enter}`, { force: true });
    cy.findByText(ERROR_MESSAGES.LOBBY.GAME_NAME.UNAUTHORIZED_CHANNEL_NAME).should("be.visible");
    cy.get("body").trigger("keyup", { key: "Escape" }); // to clear the previous alert since we want to trigger it again and not falsely see the old one
    cy.clickButton(BUTTON_NAMES.MAIN_MENU.CHANNEL);
    cy.findByLabelText(ARIA_LABELS.MAIN_MENU.CHANGE_CHANNEL_MODAL_INPUT)
      .click({ force: true })
      .clear({ force: true })
      .type(`${gameChannelNamePrefix}{enter}`, { force: true });
    cy.findByText(ERROR_MESSAGES.LOBBY.GAME_NAME.UNAUTHORIZED_CHANNEL_NAME).should("be.visible");
    //  - typing in a too long custom chat channel name shows error message
    cy.clickButton(BUTTON_NAMES.MAIN_MENU.CHANNEL);
    const oneMoreThanMaximumLengthChannelName = [];
    for (let i = chatChannelNameMaxLength + 2; i > 0; i -= 1) oneMoreThanMaximumLengthChannelName.push("a");
    const longChannelName = oneMoreThanMaximumLengthChannelName.join("");
    cy.findByLabelText(ARIA_LABELS.MAIN_MENU.CHANGE_CHANNEL_MODAL_INPUT)
      .click({ force: true })
      .clear({ force: true })
      .type(`${longChannelName}{enter}`, { force: true });
    cy.findByText(ERROR_MESSAGES.LOBBY.CHAT.CHANNEL_NAME_TOO_LONG).should("be.visible");
    //  - clicking one of the preset channel button changes channel
    //  - chat channel sidebar shows current chat channel name
    cy.clickButton(BUTTON_NAMES.MAIN_MENU.CHANNEL);
    cy.clickButton(defaultChatChannelNames.ALEXANDRIA, true);
    cy.findByLabelText(ARIA_LABELS.CHAT.CHANNEL_NAME_WITH_NUM_USERS).should("contain.text", defaultChatChannelNames.ALEXANDRIA.toLowerCase());
    //  - entering a message in a chat channel is not visible to a user in a different channel
    const notVisible = "message should not be visible";
    cy.task(TaskNames.socketEmit, {
      username,
      event: SocketEventsFromClient.NEW_CHAT_MESSAGE,
      data: new ChatMessage(notVisible),
    });
    cy.findByText(notVisible).should("not.exist");
    //  - user can type in a valid custom channel name and join that channel
    cy.clickButton(BUTTON_NAMES.MAIN_MENU.CHANNEL);
    cy.findByLabelText(ARIA_LABELS.MAIN_MENU.CHANGE_CHANNEL_MODAL_INPUT)
      .click({ force: true })
      .clear({ force: true })
      .type(`${shortTestText}{enter}`, { force: true });
    cy.findByLabelText(ARIA_LABELS.CHAT.CHANNEL_NAME_WITH_NUM_USERS).should("contain.text", shortTestText);
  });
}
