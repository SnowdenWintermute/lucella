declare namespace Cypress {
  interface Chainable {
    visitPageAndVerifyHeading(url: string, heading: string): Chainable<any>;
    clickLinkAndVerifyHeading(linkName: string, heading: string): Chainable<any>;
    verifyVeiwingMainMenu();
    openAndVerifyMenu(button: string, textToVerify: string);
  }
}
