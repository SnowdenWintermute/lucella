import { Point } from "./Point";

export class Orb {
  position: Point;
  destination: Point | null;
  velocity: Point;
  radius: number;
  color: string;
  owner: string;
  id: number;
  isGhost: boolean;
  isDashing: boolean;
  isSelected: boolean;
  constructor(position: Point, radius: number, owner: string, id: number, color: string) {
    this.position = position;
    this.destination = position;
    this.velocity = new Point(0, 0);
    this.radius = radius;
    this.color = color;
    this.owner = owner;
    this.id = id;
    this.isGhost = false;
    this.isDashing = false;
    this.isSelected = false;
  }
}
