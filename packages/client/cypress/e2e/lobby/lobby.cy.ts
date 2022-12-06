import { battleRoomDefaultChatChannel, gameRoomCountdownDuration, GameStatus, SocketEventsFromClient } from "../../../../common";
import { TaskNames } from "../../support/TaskNames";
import chatAndChangeChannels from "./chatAndChangeChannels";
const longTestText =
  "Sea sun was setting when the first of the blasts hit. John Von-Bun rocked hither and yon in the brig, occasionally puking through the rusted bars. Pirates. Pirates had saved him from his tropical Jurassic getaway. Now it would be another week or more before he’d see another meal that wasn’t what the crew of the Galley Shaggy Wag called grup or thup - depending on how many teeth they had. The pile of soaked rags in the corner of his iron hold began to groan.";
const shortTestText = "Hi";
const mediumTestText = "Ayy lmao, let's go raid area 51";

describe("lobby chat functionality", () => {
  afterEach(() => cy.task("disconnectSocket"));
  // chatAndChangeChannels();
  it("unauthed user can see a list of games update correctly and join a game and be kicked from a game", () => {
    cy.visit("/battle-room");
    cy.findByRole("button", { name: /join/i }).click();
    cy.task(TaskNames.connectSocket);
    cy.task(TaskNames.socketEmit, { socketEvent: SocketEventsFromClient.HOSTS_NEW_GAME, data: longTestText });
    cy.findByText(new RegExp(longTestText, "i")).should("not.exist");
    cy.task(TaskNames.socketEmit, { socketEvent: SocketEventsFromClient.HOSTS_NEW_GAME, data: shortTestText });
    cy.findByText(new RegExp(shortTestText, "i")).should("exist");
    cy.task(TaskNames.socketEmit, { socketEvent: SocketEventsFromClient.LEAVES_GAME, data: shortTestText });
    cy.findByText(new RegExp(shortTestText, "i")).should("not.exist");
    cy.task(TaskNames.socketEmit, { socketEvent: SocketEventsFromClient.HOSTS_NEW_GAME, data: shortTestText });
    cy.findByRole("table")
      .findByRole("button", { name: new RegExp("join", "i") })
      .click();
    cy.findByText(new RegExp(`You are challinging the host of game: ${shortTestText}`, "i")).should("exist");
    cy.findByLabelText("players in game").findAllByText(new RegExp("anon", "i")).should("have.length.of", 2);
    cy.findByRole("button", { name: new RegExp("ready", "i") }).click();
    cy.findByLabelText("challenger status").find("svg").should("exist");
    cy.findByRole("button", { name: new RegExp("ready", "i") }).click();
    cy.findByLabelText("challenger status").find("svg").should("not.exist");
    cy.findByRole("button", { name: new RegExp("ready", "i") }).click();
    cy.task(TaskNames.socketEmit, { socketEvent: SocketEventsFromClient.CLICKS_READY });
    cy.findByLabelText("host status").find("svg").should("exist");
    cy.findByText(GameStatus.COUNTING_DOWN).should("exist");
    cy.task(TaskNames.socketEmit, { socketEvent: SocketEventsFromClient.CLICKS_READY });
    cy.findByText(GameStatus.IN_LOBBY).should("exist");
    cy.findByLabelText("host status").find("svg").should("not.exist");
    cy.task(TaskNames.socketEmit, { socketEvent: SocketEventsFromClient.CLICKS_READY });
    cy.findByLabelText("host status").find("svg").should("exist");
    cy.findByText(GameStatus.COUNTING_DOWN).should("exist");
    cy.task(TaskNames.socketEmit, { socketEvent: SocketEventsFromClient.LEAVES_GAME });
    cy.findByText(new RegExp(`You are challinging the host of game: ${shortTestText}`, "i")).should("not.exist");
    cy.findByText(new RegExp(`Game ${shortTestText} closed by host.`, "i")).should("exist");

    // cy.task(TaskNames.socketEmit, { socketEvent: SocketEventsFromClient.CLICKS_READY });
    // cy.wait(gameRoomCountdownDuration + 3000);
    // cy.get('[data-cy="battle-room-canvas"]').should("exist");
    // cy.task(TaskNames.socketEmit, { socketEvent: SocketEventsFromClient.LEAVES_GAME, data: shortTestText });
    // cy.task(TaskNames.disconnectSocket);
  });
});
