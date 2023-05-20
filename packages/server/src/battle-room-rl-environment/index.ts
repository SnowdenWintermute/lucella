/* eslint-disable camelcase */
import Matter, { Detector } from "matter-js";
import {
  baseSpeedModifier,
  BattleRoomGame,
  ClientTickNumber,
  PlayerRole,
  Point,
  processPlayerInput,
  renderRate,
  SelectOrbAndAssignDestination,
  setOrbsAtStartPositions,
  UserInput,
} from "../../../common";
import resetScoreAndSpeed from "../battleRoomGame/createGamePhysicsInterval/handleScoringPoints/resetScoreAndSpeed";
import updateScoreNeededToWin from "../battleRoomGame/createGamePhysicsInterval/handleScoringPoints/updateScoreNeededToWin";

class CustomEnvironment {
  possible_agents = ["host", "challenger"];
  agents = ["host", "challenger"];
  inputNumber = 0;
  MAX_TIMESTEP = 6000;
  timestep = 0;
  game = new BattleRoomGame("game-name", { host: this.possible_agents[0], challenger: this.possible_agents[1] });
  scoresFromPreviousStep = this.game.score;

  constructor() {
    BattleRoomGame.initializeWorld(this.game);
    this.game.speedModifier = baseSpeedModifier;
    Detector.setBodies(this.game.physicsEngine!.detector, this.game.physicsEngine!.world.bodies);
  }

  reset() {
    resetScoreAndSpeed(this.game);
    setOrbsAtStartPositions(this.game.orbs);
    this.scoresFromPreviousStep = this.game.score;
    return [this.getObservations(), {}];
  }

  step(actions: { playerRole: PlayerRole; cursor_position: number[]; number_key_pressed: number }[]) {
    Object.values(actions).forEach((action) => {
      const [x, y] = action.cursor_position;
      const { number_key_pressed, playerRole } = action;
      const orbIds = [];
      if (number_key_pressed) orbIds.push(number_key_pressed);
      this.inputNumber += 1;
      this.game.queues.server.receivedInputs.push(new SelectOrbAndAssignDestination({ orbIds, mousePosition: new Point(x, y) }, this.inputNumber, playerRole));
      this.inputNumber += 1;
      this.game.queues.server.receivedInputs.push(new ClientTickNumber(null, this.inputNumber, playerRole));
    });

    console.log(JSON.stringify(this.game.queues.server.receivedInputs, null, 2));
    // const rewards = { host: 0, challenger: 0 };
    // let terminated = false;
    // let truncated = false;
    // const { game } = this;
    // let numInputsToProcess = game.queues.server.receivedInputs.length;
    // while (numInputsToProcess > 0) {
    //   const input: UserInput = game.queues.server.receivedInputs.shift();
    //   processPlayerInput(input, game, renderRate, input.playerRole);
    //   numInputsToProcess -= 1;
    //   const collisions = Detector.collisions(game.physicsEngine!.detector);
    //   collisions.forEach((collision) => {
    //     game.currentCollisionPairs.push(Matter.Pair.create(collision, +Date.now()));
    //   });
    // }
    // updateScoreNeededToWin(game);
    // // handle scoring points and calculate rewards / terminated / truncated
    // const hostNewPoints = this.game.score.host - this.scoresFromPreviousStep.host;
    // if (hostNewPoints > 0) rewards.host += hostNewPoints;
    // const challengerNewPoints = this.game.score.challenger - this.scoresFromPreviousStep.challenger;
    // if (challengerNewPoints > 0) rewards.challenger += challengerNewPoints;
    // const challengerWon = game.score.challenger >= game.score.neededToWin;
    // const hostWon = game.score.host >= game.score.neededToWin;
    // if (hostWon) rewards.host += 10;
    // if (challengerWon) rewards.challenger += 10;
    // if (hostWon || challengerWon) terminated = true;
    // if (!terminated && this.timestep > this.MAX_TIMESTEP) truncated = true;
    // this.timestep += 1;
    // const terminations = { host: terminated, challenger: terminated };
    // const truncations = { host: truncated, challenger: truncated };
    // const info = {};
    // return [this.getObservations(), rewards, terminations, truncations, info];
  }

  getObservations() {
    return {
      host: {
        ownEndzoneY: this.game.endzones.host.origin.y + this.game.endzones.host.height,
        gameSpeed: this.game.speedModifier,
        orbRadius: this.game.config.orbRadius,
        ownScore: this.game.score.host,
        opponentScore: this.game.score.challenger,
        scoreNeededToWin: this.game.score.neededToWin,
        ownOrbPositions: Object.values(this.game.orbs.host).map((orb) => {
          return { x: orb.body.position.x, y: orb.body.position.y };
        }),
        opponentOrbPositions: Object.values(this.game.orbs.challenger).map((orb) => {
          return { x: orb.body.position.x, y: orb.body.position.y };
        }),
        ownOrbGhostStatus: Object.values(this.game.orbs.host).map((orb) => orb.isGhost),
        opponentOrbGhostStatus: Object.values(this.game.orbs.challenger).map((orb) => orb.isGhost),
      },
      challenger: {
        ownEndzoneY: this.game.endzones.challenger.origin.y,
        gameSpeed: this.game.speedModifier,
        orbRadius: this.game.config.orbRadius,
        ownScore: this.game.score.challenger,
        opponentScore: this.game.score.host,
        scoreNeededToWin: this.game.score.neededToWin,
        ownOrbPositions: Object.values(this.game.orbs.challenger).map((orb) => {
          return { x: orb.body.position.x, y: orb.body.position.y };
        }),
        opponentOrbPositions: Object.values(this.game.orbs.host).map((orb) => {
          return { x: orb.body.position.x, y: orb.body.position.y };
        }),
        ownOrbGhostStatus: Object.values(this.game.orbs.challenger).map((orb) => orb.isGhost),
        opponentOrbGhostStatus: Object.values(this.game.orbs.host).map((orb) => orb.isGhost),
      },
    };
  }
}

export default new CustomEnvironment();
