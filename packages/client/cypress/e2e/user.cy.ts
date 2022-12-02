it("lets user log in", () => {
  cy.visit("/settings");
  cy.url().should("be.equal", `${Cypress.env("BASE_URL")}/login`);
  cy.findByRole("heading", { name: /sign in/i }).should("exist");
  cy.findByLabelText(/email/).type(Cypress.env("CYPRESS_TEST_USER_EMAIL"));
  cy.findByLabelText(/password/).type(`${Cypress.env("CYPRESS_TEST_PASSWORD")}{enter}`);
  cy.findByRole("heading", { name: /battle room/i }).should("exist");
});

// cy.visit("/battle-room");
//   cy.findByRole("link", { name: /login/i }).click();
