import { gameRoomCountdownDuration, GameStatus, SocketEventsFromClient } from "../../../../common";
import { veryLongTestText, shortTestText, shortTestText2 } from "../../support/consts";
import { TaskNames } from "../../support/TaskNames";

export default function unauthedJoinLeaveAndDisconnectFromGameRoom() {
  it("unauthed user can see a list of games update correctly and join a game and be kicked from a game", () => {
    cy.visit("/battle-room");
    cy.findByRole("button", { name: /join/i }).click();
    cy.task(TaskNames.connectSocket);
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.HOSTS_NEW_GAME, data: veryLongTestText });
    cy.findByText(new RegExp(veryLongTestText, "i")).should("not.exist");
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.HOSTS_NEW_GAME, data: shortTestText });
    cy.findByText(new RegExp(shortTestText, "i")).should("exist");
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.LEAVES_GAME, data: shortTestText });
    cy.findByText(new RegExp(shortTestText, "i")).should("not.exist");
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.HOSTS_NEW_GAME, data: shortTestText });
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
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.CLICKS_READY });
    cy.findByLabelText("host status").find("svg").should("exist");
    cy.findByText(GameStatus.COUNTING_DOWN).should("exist");
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.CLICKS_READY });
    cy.findByText(GameStatus.IN_LOBBY).should("exist");
    cy.findByLabelText("host status").find("svg").should("not.exist");
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.CLICKS_READY });
    cy.findByLabelText("host status").find("svg").should("exist");
    cy.findByText(GameStatus.COUNTING_DOWN).should("exist");
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.LEAVES_GAME });
    cy.findByText(new RegExp(`You are challinging the host of game: ${shortTestText}`, "i")).should("not.exist");
    cy.findByText(new RegExp(`Game ${shortTestText} closed by host.`, "i")).should("exist");
    cy.findByRole("button", { name: /join/i }).click();
    cy.get('[data-cy="list-of-current-games"]').findByText(new RegExp(shortTestText2, "i")).should("not.exist");
    cy.task(TaskNames.socketEmit, { event: SocketEventsFromClient.HOSTS_NEW_GAME, data: shortTestText2 });
    cy.get('[data-cy="list-of-current-games"]').findByText(new RegExp(shortTestText2, "i")).should("exist");
    cy.findByRole("table")
      .findByRole("button", { name: new RegExp("join", "i") })
      .click();
    cy.task(TaskNames.disconnectSocket);
    cy.findByText(new RegExp(`Game ${shortTestText2} closed by host.`, "i")).should("exist");
  });
}