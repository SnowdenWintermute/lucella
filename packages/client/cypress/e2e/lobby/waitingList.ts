import { AuthRoutePaths, baseMaxConcurrentGames, FrontendRoutes, gameRoomCountdownDuration, GameStatus, SocketEventsFromClient } from "../../../../common";
import { TaskNames } from "../../support/TaskNames";

export default function waitingList() {
  const args = {
    CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
    CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
  };

  // eslint-disable-next-line no-undef
  before(() => {
    // delete all test users (test users are defined in the UsersRepo deleteTestUsers method)
    cy.task(TaskNames.deleteAllTestUsers, args).then((response: Response) => {
      expect(response.status).to.equal(200);
    });
    cy.task(TaskNames.createCypressTestUser, args).then((response: Response) => {
      expect(response.status).to.equal(201);
    });
    cy.task(TaskNames.createSequentialEloTestUsers, { ...args, numberToCreate: 5, eloOfFirst: 1000, eloBetweenEach: 100 }).then((response: Response) => {
      expect(response.status).to.equal(201);
    });
    cy.task(TaskNames.setMaxConcurrentGames, { ...args, maxConcurrentGames: 1 });
  });

  // eslint-disable-next-line no-undef
  after(() => {
    cy.task(TaskNames.setMaxConcurrentGames, { ...args, maxConcurrentGames: baseMaxConcurrentGames });
  });

  it("shows waiting list position, updates the position", () => {
    const username = Cypress.env("CYPRESS_TEST_USER_NAME");
    // log in and host a game
    cy.request("POST", `http://localhost:8080/api${AuthRoutePaths.ROOT}`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    }).then((res) => console.log(res));
    cy.visitPageAndVerifyHeading(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`, "battle room");
    // set the limit to 1 concurrent game
    // start 1 game between two test users
    //
    // attempt to start (both ready up) another game between two test users
    // host a game and have the last test user join and both ready up
    //  should show waiting list update
    // have test user unready, it should put this room back IN_LOBBY
    // have test user ready up again, should show waiting list update
    // have first game end, should show updated waiting list position
    // have second game end, should show counting down
    // look for game frame and assert it exists
  });
}
