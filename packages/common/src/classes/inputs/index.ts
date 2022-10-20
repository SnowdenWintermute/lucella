import { UserInput } from "./UserInput";
import { UserInputs } from "../../enums/UserInputs";
import { Point } from "../Point";

interface KeyPressData {
  keyPressed: number;
  mousePosition: Point | null;
}

export class KeyPress extends UserInput {
  constructor(data: KeyPressData, tick: number) {
    super(UserInputs.KEYPRESS, data, tick);
  }
}

interface MouseUpData {
  mousePosition: Point | null;
}

export class LeftMouseDown extends UserInput {
  constructor(data: MouseUpData, tick: number) {
    super(UserInputs.LEFT_MOUSE_DOWN, data, tick);
  }
}

export class RightMouseUp extends UserInput {
  constructor(data: MouseUpData, tick: number) {
    super(UserInputs.RIGHT_MOUSE_UP, data, tick);
  }
}

export class LeftMouseUp extends UserInput {
  constructor(data: MouseUpData, tick: number) {
    super(UserInputs.LEFT_MOUSE_UP, data, tick);
  }
}

export class MouseLeave extends UserInput {
  constructor(data: MouseUpData, tick: number) {
    super(UserInputs.MOUSE_LEAVE, data, tick);
  }
}
