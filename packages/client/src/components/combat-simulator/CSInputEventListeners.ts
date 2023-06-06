import { CSPlayerInputState, CombatSimulator } from "../../../../common";

function logCode(e: KeyboardEvent) {
  console.log(e.code);
}

function setInputs(e: KeyboardEvent, inputs: CSPlayerInputState) {
  const { code } = e;
  if (code === "KeyW") inputs.up = true;
  if (code === "KeyS") inputs.down = true;
  if (code === "KeyA") inputs.left = true;
  if (code === "KeyD") inputs.right = true;
  if (code === "Space") inputs.space = true;
  console.log(inputs);
}

export function addCSInputEventListeners(canvas: HTMLCanvasElement, cs: CombatSimulator) {
  canvas.addEventListener("keydown", logCode);
  canvas.addEventListener("keydown", (e) => setInputs(e, cs.inputState));
}
export function removeCSInputEventListeners(canvas: HTMLCanvasElement, cs: CombatSimulator) {
  canvas.removeEventListener("keydown", logCode);
  canvas.removeEventListener("keydown", (e) => setInputs(e, cs.inputState));
}
