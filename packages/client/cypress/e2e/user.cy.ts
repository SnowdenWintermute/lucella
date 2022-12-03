it("Redirects unauthorized user from /settings to /login and lets them sign in, redirecting them to /battle-room. Then they can select settings and it brings them to /settings", () => {
  cy.visit("/settings");
  cy.url().should("be.equal", `${Cypress.env("BASE_URL")}/login`);
  cy.findByRole("heading", { name: /sign in/i }).should("exist");
  cy.findByLabelText(/email/).type(Cypress.env("CYPRESS_TEST_USER_EMAIL"));
  cy.findByLabelText(/password/).type(`${Cypress.env("CYPRESS_TEST_PASSWORD")}{enter}`);
  cy.findByRole("heading", { name: /battle room/i }).should("exist");
  cy.visit("/settings");
  cy.findByRole("heading", { name: /settings/i }).should("exist");
  cy.findByText(`Logged in as ${Cypress.env("CYPRESS_TEST_USER_EMAIL")}`).should("exist");
});

// test refresh token and token expiration

// user host/joins game, leaves game
