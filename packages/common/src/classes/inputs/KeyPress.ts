import { UserInput } from "./UserInput";
import { UserInputs } from "../../enums/UserInputs";
import { Point } from "../Point";

interface Data {
  keyPressed: number;
  mousePosition: Point | null;
}

export class KeyPress extends UserInput {
  constructor(data: Data) {
    super(UserInputs.KEYPRESS, data);
  }
}
