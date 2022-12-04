import { battleRoomDefaultChatChannel } from "../../../../common/dist";
import { TaskNames } from "../../support/TaskNames";
import chatAndChangeChannels from "./chatAndChangeChannels";
const longTestText =
  "Sea sun was setting when the first of the blasts hit. John Von-Bun rocked hither and yon in the brig, occasionally puking through the rusted bars. Pirates. Pirates had saved him from his tropical Jurassic getaway. Now it would be another week or more before he’d see another meal that wasn’t what the crew of the Galley Shaggy Wag called grup or thup - depending on how many teeth they had. The pile of soaked rags in the corner of his iron hold began to groan.";
const shortTestText = "Hi";
const mediumTestText = "Ayy lmao, let's go raid area 51";

describe("lobby chat functionality", () => {
  afterEach(() => cy.task("disconnectSocket"));
  // chatAndChangeChannels();
  it("lets two anon users host and join a game", () => {
    cy.visit("/battle-room");
    cy.findByRole("button", { name: /join/i }).click();
    cy.task(TaskNames.connectSocket);
    cy.task(TaskNames.hostGame, shortTestText);
    cy.findByText(new RegExp(shortTestText, "i")).should("exist");
    // cy.task(TaskNames.leaveGame, shortTestText);
    // cy.findByText(new RegExp(shortTestText, "i")).should("not.exist");
    // cy.task(TaskNames.disconnectSocket);
  });
});
