import Matter from "matter-js";
import { Entity } from "./Entity";

export class MobileEntity extends Entity {
  acceleration: number;
  topSpeed: number;
  jumpHeight: number;
  constructor(id: number, owner: string, acceleration: number, topSpeed: number, jumpHeight: number) {
    const body = Matter.Bodies.polygon(0, 0, 8, 10);
    body.frictionAir = 1;
    body.mass = 1000;
    super(id, body, 1, 1, owner, { max: 10, current: 10 });
    this.acceleration = acceleration;
    this.topSpeed = topSpeed;
    this.jumpHeight = jumpHeight;
  }
}
