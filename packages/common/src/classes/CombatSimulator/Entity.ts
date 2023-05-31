import Matter from "matter-js";

export class Entity {
  body: Matter.Body;
  height: number;
  z: number;
  owner: string;
  hp: {
    max: number;
    current: number;
  };
  constructor(body: Matter.Body, height: number, z: number, owner: string, hp: { max: number; current: number }) {
    this.body = body;
    this.height = height;
    this.z = z;
    this.owner = owner;
    this.hp = hp;
  }
}
