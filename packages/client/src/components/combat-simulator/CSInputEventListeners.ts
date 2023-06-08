import { CSPlayerInputState, CombatSimulator } from "../../../../common";

function logCode(e: KeyboardEvent) {
  console.log(e.code);
}

function setInputs(e: KeyboardEvent, inputs: CSPlayerInputState, active: boolean) {
  const { code } = e;
  if (code === "KeyW") inputs.up = active;
  if (code === "KeyS") inputs.down = active;
  if (code === "KeyA") inputs.left = active;
  if (code === "KeyD") inputs.right = active;
  if (code === "Space") inputs.space = active;
  if (code === "KeyJ") inputs.turnLeft = active;
  if (code === "KeyK") inputs.turnRight = active;
  // console.log("inputs: ", inputs);
}

// function setTurnInputs(e: MouseEvent)

export function addCSInputEventListeners(canvas: HTMLCanvasElement, cs: CombatSimulator) {
  canvas.addEventListener("keydown", logCode);
  canvas.addEventListener("keydown", (e) => setInputs(e, cs.inputState, true));
  canvas.addEventListener("keyup", (e) => setInputs(e, cs.inputState, false));
}
export function removeCSInputEventListeners(canvas: HTMLCanvasElement, cs: CombatSimulator) {
  canvas.removeEventListener("keydown", logCode);
  canvas.removeEventListener("keydown", (e) => setInputs(e, cs.inputState, true));
  canvas.removeEventListener("keyup", (e) => setInputs(e, cs.inputState, false));
}
