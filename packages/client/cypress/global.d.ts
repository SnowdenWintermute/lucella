declare namespace Cypress {
  interface Chainable {
    visitPageAndVerifyHeading(url: string, heading: string): Chainable<any>;
    clickLinkAndVerifyHeading(url: string, heading: string): Chainable<any>;
  }
}
