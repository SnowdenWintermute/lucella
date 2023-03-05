import {
  AuthRoutePaths,
  battleRoomDefaultChatChannel,
  BattleRoomGame,
  FrontendRoutes,
  gameRoomCountdownDuration,
  ONE_SECOND,
  rankedGameChannelNamePrefix,
  SocketEventsFromClient,
  createAdjustedCoordinateCalculator,
} from "../../../../common";
import { TaskNames } from "../../support/TaskNames";
import { MATCHMAKING_QUEUE } from "../../../src/consts/lobby-text";

describe("play game", () => {
  // eslint-disable-next-line no-undef
  before(() => {
    const args = {
      CYPRESS_BACKEND_URL: Cypress.env("CYPRESS_BACKEND_URL"),
      CYPRESS_TESTER_KEY: Cypress.env("CYPRESS_TESTER_KEY"),
    };
    // delete all test users (test users are defined in the UsersRepo deleteTestUsers method)
    cy.task(TaskNames.deleteAllTestUsers, args).then((response: Response) => {
      expect(response.status).to.equal(200);
      cy.task(TaskNames.createCypressTestUser, args).then((firstCreateTestUserResponse: Response) => {
        expect(firstCreateTestUserResponse.status).to.equal(201);
      });
      cy.task(TaskNames.createCypressTestUser, {
        ...args,
        name: Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE"),
        email: Cypress.env("CYPRESS_TEST_USER_EMAIL_ALTERNATE"),
      }).then((secondCreateTestUserResponse: Response) => {
        expect(secondCreateTestUserResponse.status).to.equal(201);
      });
    });
  });

  // eslint-disable-next-line no-undef
  after(() => {
    cy.task(TaskNames.disconnectSocket, { username: Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE") });
  });

  it("joins the matchmaking queue and plays a game", () => {
    const username = Cypress.env("CYPRESS_TEST_USER_NAME");
    const alternateUsername = Cypress.env("CYPRESS_TEST_USER_NAME_ALTERNATE");
    // log in so we can play ranked
    cy.request("POST", `http://localhost:8080/api${AuthRoutePaths.ROOT}`, {
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    });
    // log in other user
    cy.task(TaskNames.logUserIn, {
      name: alternateUsername,
      email: Cypress.env("CYPRESS_TEST_USER_EMAIL_ALTERNATE"),
      password: Cypress.env("CYPRESS_TEST_USER_PASSWORD"),
    }).then(() => {
      cy.task(TaskNames.connectSocket, { username: alternateUsername, withHeaders: true });
      cy.task(TaskNames.socketEmit, {
        username: alternateUsername,
        event: SocketEventsFromClient.REQUESTS_TO_JOIN_CHAT_CHANNEL,
        data: battleRoomDefaultChatChannel,
      });
    });
    cy.visit(`${Cypress.env("BASE_URL")}${FrontendRoutes.BATTLE_ROOM}`);
    cy.findByRole("heading", { name: /battle room/i }).should("be.visible");
    cy.findByText(username).should("be.visible");
    cy.findByText(alternateUsername).should("be.visible");
    cy.task(TaskNames.socketEmit, { username: alternateUsername, event: SocketEventsFromClient.ENTERS_MATCHMAKING_QUEUE });
    cy.findByRole("button", { name: /ranked/i }).click();
    cy.findByText(new RegExp(MATCHMAKING_QUEUE.SEEKING_RANKED_MATCH, "i")).should("be.visible");
    cy.wait(gameRoomCountdownDuration * ONE_SECOND + ONE_SECOND);
    cy.get('[data-cy="battle-room-canvas"]').should("be.visible");
    // select all orbs and send them to opponent end zone
    cy.get("body").click("topLeft");
    cy.get('[data-cy="battle-room-canvas"]').then((canvas) => {
      const getAdjustedX = createAdjustedCoordinateCalculator(BattleRoomGame.baseWindowDimensions.width, 0.6);
      const getAdjustedY = createAdjustedCoordinateCalculator(BattleRoomGame.baseWindowDimensions.height, 1);
      const windowHeight = Cypress.config("viewportHeight");
      cy.wrap(canvas)
        .trigger("keydown", { key: "0" })
        .trigger("keydown", { key: "0" })
        .trigger("mousemove", getAdjustedX(10, windowHeight), getAdjustedY(10, windowHeight), {
          eventConstructor: "MouseEvent",
        })
        .wait(100)
        .trigger("mousedown", { button: 0, eventConstructor: "MouseEvent" })
        .trigger("mousemove", getAdjustedX(400, windowHeight), getAdjustedY(200, windowHeight), { eventConstructor: "MouseEvent" })
        .wait(100)
        .trigger("mouseup", { eventConstructor: "MouseEvent" })
        .trigger("mousemove", getAdjustedX(10, windowHeight), getAdjustedY(730, windowHeight), { eventConstructor: "MouseEvent" })
        .wait(100)
        .trigger("mouseup", { button: 2, eventConstructor: "MouseEvent" })
        //
        .trigger("mousemove", getAdjustedX(10, windowHeight), getAdjustedY(600, windowHeight), {
          eventConstructor: "MouseEvent",
        })
        .wait(100)
        .trigger("mousedown", { button: 0, eventConstructor: "MouseEvent" })
        .trigger("mousemove", getAdjustedX(400, windowHeight), getAdjustedY(730, windowHeight), { eventConstructor: "MouseEvent" })
        .wait(100)
        .trigger("mouseup", { eventConstructor: "MouseEvent" })
        .trigger("mousemove", getAdjustedX(430, windowHeight), getAdjustedY(10, windowHeight), { eventConstructor: "MouseEvent" })
        .wait(100)
        .trigger("mouseup", { button: 2, eventConstructor: "MouseEvent" });
    });

    cy.get('[data-cy="score-screen-modal"]')
      .findByText(new RegExp(`Game ${rankedGameChannelNamePrefix}\\d+ final score:`, "i"))
      .should("exist");
    cy.get('[data-cy="score-screen-modal"]')
      .contains(new RegExp(`${username}:`, "i"))
      .should("be.visible");
    cy.get('[data-cy="score-screen-modal"]')
      .contains(new RegExp(`${alternateUsername}:`, "i"))
      .should("be.visible");
  });
});
