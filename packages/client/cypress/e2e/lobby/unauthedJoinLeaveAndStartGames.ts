import { GameStatus, SocketEventsFromClient } from "../../../../common/dist";
import { longTestText, shortTestText } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

export default function unauthedJoinLeaveAndStartGames() {
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
}
