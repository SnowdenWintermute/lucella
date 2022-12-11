import { battleRoomDefaultChatChannel, SocketEventsFromClient } from "../../../../common";
import { veryLongTestText, mediumTestText, shortTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

export default function chatAndChangeChannels() {
  return it("users can see other users in their channel chat, not see chat from other channels, change channels, and see other user list update when users change channels or disconnect", () => {
    cy.visit("/battle-room");
    cy.findByText("Server : Welcome to battle-room-chat.").should("exist");

    cy.task(TaskNames.connectSocket);
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, data: battleRoomDefaultChatChannel });
    cy.findByLabelText(/users in this channel/i)
      .findAllByText(/Anon/i)
      .should("have.length", 2);
    cy.task(TaskNames.socketEmit, {
      event: SocketEventsFromClient.NEW_CHAT_MESSAGE,
      data: {
        style: "normal",
        text: veryLongTestText,
      },
    });

    cy.findByText(new RegExp(`${veryLongTestText}`)).should("exist");
    cy.findByLabelText("chat-input").click().type(`${mediumTestText}{enter}`);
    cy.findByText(new RegExp(`${mediumTestText}`)).should("exist");
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL, data: "test" });
    cy.findByLabelText(/users in this channel/i)
      .findAllByText(/anon/i)
      .should("have.length", 1);
    cy.task(TaskNames.socketEmit, {
      event: SocketEventsFromClient.NEW_CHAT_MESSAGE,
      data: {
        style: "normal",
        text: shortTestText,
      },
    });
    cy.findByText(new RegExp(`${shortTestText}`)).should("not.exist"); // because haven't joined the channel it was sent to yet
    cy.findByRole("button", { name: /channel/i }).click();
    cy.findByLabelText("channel to join").click().type("test{enter}");
    cy.findByText("Server : Welcome to test.").should("exist");
    cy.findByLabelText(/users in this channel/i)
      .findAllByText(/anon/i)
      .should("have.length", 2);
    cy.task(TaskNames.socketEmit, {
      event: SocketEventsFromClient.NEW_CHAT_MESSAGE,
      data: {
        style: "normal",
        text: shortTestText,
      },
    });
    cy.findByText(new RegExp(`${shortTestText}`)).should("exist");
    cy.task("disconnectSocket");
    cy.findByLabelText(/users in this channel/i)
      .findAllByText(/anon/i)
      .should("have.length", 1);
  });
}
