it(`login form shows correct errors,
    field errors dissapear when user starts typing in the respective field`, () => {
  cy.visit("/login");
  cy.url().should("be.equal", `${Cypress.env("BASE_URL")}/login`);
  cy.findByRole("heading", { name: /sign in/i }).should("exist");
  cy.findByRole("button", { name: /sign/i }).click();
  cy.get(`[data-cy="error-email"]`).should("exist");
  cy.get(`[data-cy="error-password"]`).should("exist");
  cy.findByLabelText(/email/).type(Cypress.env("CYPRESS_TEST_USER_EMAIL"));
  cy.get(`[data-cy="error-email"]`).should("not.exist");
  cy.get(`[data-cy="error-password"]`).should("exist");
  cy.findByLabelText(/password/).type(`the wrong password{enter}`);
  cy.get(`[data-cy="error-password"]`).should("not.exist");
});

// test refresh token and token expiration

// user host/joins game, leaves game
