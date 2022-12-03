it("sees the 2nd user join", () => {
  // the browser is the 1st user
  const name = `Cy_${Cypress._.random(1000)}`;
  cy.log(`User **${name}**`);
  cy.visit("/battle-room");
  cy.findByText("Server : Welcome to battle-room-chat.").should("exist");

  // connect to the server using 2nd user
  const secondName = "Ghost";
  cy.task("connectSocket", secondName);
  cy.task("sendChatMessage", "ay");
  cy.task("sendChatMessage", "ay");
  cy.task("sendChatMessage", "ay");
});
