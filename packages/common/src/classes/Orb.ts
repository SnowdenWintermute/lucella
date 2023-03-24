import Matter from "matter-js";
import { Point } from "./Point";

export class Orb {
  body: Matter.Body;
  destination: Point | null = null;
  color: string | undefined;
  strokeColor: string | undefined;
  owner: string;
  id: number;
  isGhost = false;
  isDashing = false;
  isSelected = false;
  positionBuffer: { position: Point; timestamp: number }[] = [];
  debug?: { numInputsAppliedBeforeComingToRest?: number; highestNumberInputApplied?: number } = {
    numInputsAppliedBeforeComingToRest: 0,
    highestNumberInputApplied: 0,
  };
  constructor(body: Matter.Body, owner: string, id: number, color?: string, strokeColor?: string) {
    this.body = body;
    this.color = color;
    this.strokeColor = strokeColor;
    this.owner = owner;
    this.id = id;
  }
}
