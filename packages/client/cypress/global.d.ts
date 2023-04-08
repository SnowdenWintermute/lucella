declare namespace Cypress {
  interface Chainable {
    deleteAllTestUsersAndCreateOneTestUser();
    openLastEmail();
    clickButton(buttonName: string, force?: boolean);
    visitPageAndVerifyHeading(url: string, heading: string): Chainable<any>;
    clickLinkAndVerifyHeading(linkName: string, heading: string): Chainable<any>;
    verifyVeiwingMainMenu();
    openAndVerifyMenu(button: string, textToVerify: string);
    hostCasualGame(gameName: string);
    createAndLogInSequentialEloTestUsers(numberToCreate: number, eloOfFirst: number, eloBetweenEach: number, testUsers: Object);
  }
}
