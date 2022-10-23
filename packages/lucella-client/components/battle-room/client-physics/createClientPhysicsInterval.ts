import { BattleRoomGame, physicsTickRate, PlayerRole, processPlayerInput } from "../../../../common";

export default function createClientPhysicsInterval(currentGame: BattleRoomGame, playerRole: PlayerRole | null) {
  return setInterval(() => {
    // predict own orbs
    //   discard all saved inputs that are older client tick than last input processed by the server
    //   server can send difference between server tick and client tick at the moment it processed the input
    //   snap own orbs to posotion of last server update
    //   re-run physics on own orbs to the currentTick
    // show delayed opponent orbs
    //
    const { lastUpdateFromServer } = currentGame;
    if (!lastUpdateFromServer) return;
    // console.log(lastUpdateFromServer);
    const lastProcessedClientInputTick = lastUpdateFromServer.lastProcessedClientInputTicks[playerRole!];
    const inputsToSimulate: any = [];

    currentGame.queues.client.localInputs.forEach((input, i) => {
      if (input.tick < lastProcessedClientInputTick) console.log(currentGame.queues.client.localInputs.splice(i, 1));
    });
    currentGame.queues.client.localInputs.forEach((input, i) => {
      const nextInput = currentGame.queues.client.localInputs[i + 1];
      let numberOfTicksToSimulate: number;
      if (nextInput) {
        console.log("next input: ", nextInput);
        numberOfTicksToSimulate = nextInput.tick - input.tick;
      } else numberOfTicksToSimulate = currentGame.currentTick - input.tick;
      inputsToSimulate.push({ input, numberOfTicksToSimulate });
    });

    inputsToSimulate.forEach((inputWithTicks: any) => {
      for (let i = 0; i < inputWithTicks.numberOfTicksToSimulate; i++) {
        console.log("processing: ", inputWithTicks.input);
        processPlayerInput(inputWithTicks.input, currentGame);
      }
    });

    const enemyPlayerRole = playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;
    currentGame.orbs[enemyPlayerRole] = lastUpdateFromServer.orbs[enemyPlayerRole];

    currentGame.currentTick = currentGame.currentTick <= 65535 ? currentGame.currentTick + 1 : 0;
    // write to the render buffer
  }, physicsTickRate);
}
