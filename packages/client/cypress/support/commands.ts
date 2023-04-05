import "@testing-library/cypress/add-commands";
import { BUTTON_NAMES } from "../../src/consts/button-names";

Cypress.Commands.add("visitPageAndVerifyHeading", (url: string, heading: string) => {
  cy.visit(url);
  cy.findByRole("heading", { name: new RegExp(heading, "i") }).should("be.visible");
});
Cypress.Commands.add("clickLinkAndVerifyHeading", (link: string, heading: string) => {
  cy.findByRole("link", { name: new RegExp(link, "i") }).click();
  cy.findByRole("heading", { name: new RegExp(heading, "i") }).should("be.visible");
});
Cypress.Commands.add("verifyVeiwingMainMenu", () => {
  cy.findByRole("button", { name: BUTTON_NAMES.MAIN_MENU.CHANNEL }).should("be.visible");
  cy.findByRole("button", { name: BUTTON_NAMES.MAIN_MENU.RANKED }).should("be.visible");
  cy.findByRole("button", { name: BUTTON_NAMES.MAIN_MENU.HOST }).should("be.visible");
  cy.findByRole("button", { name: BUTTON_NAMES.MAIN_MENU.JOIN }).should("be.visible");
});
Cypress.Commands.add("openAndVerifyMenu", (menuButton: string, textToVerify: string) => {
  cy.findByRole("button", { name: menuButton }).click();
  cy.findByText(textToVerify).should("be.visible");
});
