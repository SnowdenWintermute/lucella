import { battleRoomDefaultChatChannel } from "../../../../common";
import { TaskNames } from "../../support/TaskNames";
const longTestText =
  "Sea sun was setting when the first of the blasts hit. John Von-Bun rocked hither and yon in the brig, occasionally puking through the rusted bars. Pirates. Pirates had saved him from his tropical Jurassic getaway. Now it would be another week or more before he’d see another meal that wasn’t what the crew of the Galley Shaggy Wag called grup or thup - depending on how many teeth they had. The pile of soaked rags in the corner of his iron hold began to groan.";
const shortTestText = "Hi";
const mediumTestText = "Ayy lmao, let's go raid area 51";

export default function chatAndChangeChannels() {
  return it("users can see other users in their channel chat, not see chat from other channels, change channels, and see other user list update when users change channels or disconnect", () => {
    cy.visit("/battle-room");
    cy.findByText("Server : Welcome to battle-room-chat.").should("exist");

    cy.task(TaskNames.connectSocket);
    cy.task(TaskNames.joinChatChannel, battleRoomDefaultChatChannel);
    cy.findByLabelText(/users in this channel/i)
      .findAllByText(/Anon/i)
      .should("have.length", 2);
    cy.task(TaskNames.sendChatMessage, {
      style: "normal",
      text: longTestText,
    });

    cy.findByText(new RegExp(`${longTestText}`)).should("exist");
    cy.findByLabelText("chat-input").click().type(`${mediumTestText}{enter}`);
    cy.findByText(new RegExp(`${mediumTestText}`)).should("exist");
    cy.task(TaskNames.joinChatChannel, "test");
    cy.findByLabelText(/users in this channel/i)
      .findAllByText(/anon/i)
      .should("have.length", 1);
    cy.task(TaskNames.sendChatMessage, {
      style: "normal",
      text: shortTestText,
    });
    cy.findByText(new RegExp(`${shortTestText}`)).should("not.exist"); // because haven't joined the channel it was sent to yet
    cy.findByRole("button", { name: /channel/i }).click();
    cy.findByLabelText("channel to join").click().type("test{enter}");
    cy.findByText("Server : Welcome to test.").should("exist");
    cy.findByLabelText(/users in this channel/i)
      .findAllByText(/anon/i)
      .should("have.length", 2);
    cy.task(TaskNames.sendChatMessage, {
      style: "normal",
      text: shortTestText,
    });
    cy.findByText(new RegExp(`${shortTestText}`)).should("exist");
    cy.task("disconnectSocket");
    cy.findByLabelText(/users in this channel/i)
      .findAllByText(/anon/i)
      .should("have.length", 1);
  });
}
