import Matter from "matter-js";
import { Entity } from "./Entity";

export class MobileEntity extends Entity {
  acceleration: number;
  topSpeed: number;
  jumpHeight: number;
  constructor(owner: string, acceleration: number, topSpeed: number, jumpHeight: number) {
    const body = Matter.Bodies.polygon(0, 0, 8, 10);
    super(body, 1, 1, owner, { max: 10, current: 10 });
    this.acceleration = acceleration;
    this.topSpeed = topSpeed;
    this.jumpHeight = jumpHeight;
  }
}
