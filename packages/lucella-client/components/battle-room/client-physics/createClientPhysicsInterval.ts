import { BattleRoomGame, Orb, physicsTickRate, PlayerRole, processPlayerInput, updateOrbs } from "../../../../common";
import reconciliationNeeded from "./reconciliationNeeded";
import cloneDeep from "lodash.clonedeep";

export default function createClientPhysicsInterval(currentGame: BattleRoomGame, playerRole: PlayerRole | null) {
  return setInterval(() => {
    //   server can send difference between server tick and client tick at the moment it processed the input
    const lastUpdateFromServerCopy = cloneDeep(currentGame.lastUpdateFromServer);
    const newGameState = cloneDeep(currentGame);
    if (!lastUpdateFromServerCopy || !playerRole)
      return console.log("awaiting first server update before starting client physics");
    const lastProcessedClientTick = lastUpdateFromServerCopy.serverLastKnownClientTicks[playerRole];
    const ticksSinceLastClientTickConfirmedByServer = currentGame.currentTick - lastProcessedClientTick;
    const inputsToSimulate: any = [];

    // newGameState.orbs[playerRole].forEach((orb, i) => {
    //   orb.position = cloneDeep(lastUpdateFromServerCopy.orbs[playerRole][i].position);
    // });
    newGameState.orbs[playerRole] = cloneDeep(lastUpdateFromServerCopy.orbs[playerRole]);

    currentGame.queues.client.localInputs.forEach((input, i) => {
      if (input.tick < lastProcessedClientTick) return currentGame.queues.client.localInputs.splice(i, 1);
      const nextInput = currentGame.queues.client.localInputs[i + 1];
      if (nextInput) inputsToSimulate.push({ input, numberOfTicksToSimulate: nextInput.tick - input.tick });
      else inputsToSimulate.push({ input, numberOfTicksToSimulate: currentGame.currentTick - input.tick });
    });

    currentGame.clientPrediction.inputsToSimulate = inputsToSimulate;
    currentGame.clientPrediction.ticksSinceLastClientTickConfirmedByServer = ticksSinceLastClientTickConfirmedByServer;
    currentGame.clientPrediction.clientServerTickDifference = currentGame.currentTick - lastUpdateFromServerCopy.tick;

    if (inputsToSimulate.length > 0) {
      inputsToSimulate.forEach((inputWithTicks: any, i: number) => {
        if (i === 0) {
          for (let i = 0; i < inputWithTicks.input.tick - lastProcessedClientTick; i++)
            updateOrbs(newGameState, undefined, playerRole);
        }
        currentGame.clientPrediction.simulatingBetweenInputs = true;
        processPlayerInput(inputWithTicks.input, newGameState);
        for (let i = 0; i < inputWithTicks.numberOfTicksToSimulate; i++)
          updateOrbs(newGameState, undefined, playerRole);
      });
    } else {
      for (let i = 0; i < ticksSinceLastClientTickConfirmedByServer; i++)
        updateOrbs(newGameState, undefined, playerRole);
      currentGame.clientPrediction.simulatingBetweenInputs = false;
    }

    // reconciliationNeeded(lastUpdateFromServerCopy, currentGame, playerRole);

    const opponentRole = playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;
    newGameState.orbs[opponentRole] = cloneDeep(lastUpdateFromServerCopy.orbs[opponentRole]);

    currentGame.orbs = cloneDeep(newGameState.orbs);
    currentGame.currentTick = currentGame.currentTick <= 65535 ? currentGame.currentTick + 1 : 0;
  }, physicsTickRate);
}
