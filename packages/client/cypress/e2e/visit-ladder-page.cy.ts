it("visits the ladder page from the home page", () => {
  cy.visit("/battle-room");
  cy.findByRole("link", { name: /ladder/i }).click();
  cy.findByRole("heading", { name: /ladder/i }).should("exist");
});
