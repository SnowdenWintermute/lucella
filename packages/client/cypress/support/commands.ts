import "@testing-library/cypress/add-commands";

Cypress.Commands.add("visitPageAndVerifyHeading", (url: string, heading: string) => {
  cy.visit(url);
  cy.findByRole("heading", { name: new RegExp(heading, "i") }).should("be.visible");
});
Cypress.Commands.add("clickLinkAndVerifyHeading", (link: string, heading: string) => {
  cy.findByRole("link", { name: new RegExp(link, "i") }).click();
  cy.findByRole("heading", { name: new RegExp(heading, "i") }).should("be.visible");
});
