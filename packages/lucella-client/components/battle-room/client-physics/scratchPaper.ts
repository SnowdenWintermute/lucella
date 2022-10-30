export default function first() {
  currentGame.queues.client.localInputs.forEach((input, i) => {
    if (input.tick <= lastProcessedClientTick) return currentGame.queues.client.localInputs.splice(i, 1);
    const nextInput = currentGame.queues.client.localInputs[i + 1];
    if (nextInput) inputsToSimulate.push({ input, numberOfTicksToSimulate: nextInput.tick - input.tick });
    else inputsToSimulate.push({ input, numberOfTicksToSimulate: currentGame.currentTick - input.tick });
  });

  if (inputsToSimulate.length > 0) {
    inputsToSimulate.forEach((inputWithTicks: any, inputIndex: number) => {
      if (inputIndex === 0)
        for (let i = 0; i < inputWithTicks.input.tick - lastProcessedClientTick; i++)
          updateOrbs(newGameState, undefined, playerRole);
      currentGame.debug.clientPrediction.simulatingBetweenInputs = true;
      processPlayerInput(inputWithTicks.input, newGameState);
      for (let i = 0; i < inputWithTicks.numberOfTicksToSimulate; i++) updateOrbs(newGameState, undefined, playerRole);
    });
  } else {
    for (let i = 0; i < ticksSinceLastClientTickConfirmedByServer; i++) updateOrbs(newGameState, undefined, playerRole);
    currentGame.debug.clientPrediction.simulatingBetweenInputs = false;
  }
}
