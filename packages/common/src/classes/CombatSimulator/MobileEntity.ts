export class MobileEntity {
  acceleration: number;
  topSpeed: number;
  jumpHeight: number;
  constructor(acceleration: number, topSpeed: number, jumpHeight: number) {
    this.acceleration = acceleration;
    this.topSpeed = topSpeed;
    this.jumpHeight = jumpHeight;
  }
}
