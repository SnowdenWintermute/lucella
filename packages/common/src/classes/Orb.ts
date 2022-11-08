import Matter from "matter-js";
import { Point } from "./Point";

export class Orb {
  body: Matter.Body;
  destination: Point | null;
  color: string;
  owner: string;
  id: number;
  isGhost: boolean;
  isDashing: boolean;
  isSelected: boolean;
  positionBuffer: { position: Point; timestamp: number }[];
  constructor(body: Matter.Body, owner: string, id: number, color: string) {
    this.body = body;
    this.destination = new Point(body.position.x, body.position.y);
    this.color = color;
    this.owner = owner;
    this.id = id;
    this.isGhost = false;
    this.isDashing = false;
    this.isSelected = false;
    this.positionBuffer = [];
  }
}
