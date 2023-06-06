import { CSPlayerInputState, CombatSimulator } from "../../../../common";

export default function determineCSUserInputDeltas(cs: CombatSimulator) {
  const prevInputs = cs.netcode.prevGameState?.inputs;
  const currInputs = cs.inputState;
  if (!prevInputs) return console.log("Couldnt' calculate deltas without an initial game state");

  const deltas = new CSPlayerInputState();
  Object.entries(currInputs).forEach(([key, value]) => {
    // @ts-ignore
    // if (typeof value === "boolean") console.log("key pressed: ", key, value, cs.netcode.prevGameState!.inputs[key]);
    // @ts-ignore
    if (value !== prevInputs[key]) {
      console.log("detected delta for input ", key);
      // @ts-ignore
      deltas[key] = value;
    }
  });

  // console.log("input deltas: ", deltas);

  return deltas;
}
