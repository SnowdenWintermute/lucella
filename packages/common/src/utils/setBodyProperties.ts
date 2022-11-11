import Matter, { Vector } from "matter-js";

interface BodyProperties {
  position?: Vector;
  inertia?: number;
  velocity?: Vector;
  angle?: number;
  angularVelocity?: number;
}

export const setBodyProperties = (body: Matter.Body, properties: BodyProperties) => {
  const { position, inertia, velocity, angle, angularVelocity } = properties;
  position && Matter.Body.setPosition(body, position);
  // inertia && Matter.Body.setInertia(body, inertia);
  // velocity && Matter.Body.setVelocity(body, velocity);
  // angle && Matter.Body.setAngle(body, angle);
  // angularVelocity && Matter.Body.setAngularVelocity(body, angularVelocity);
};
