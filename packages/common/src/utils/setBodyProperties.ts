import Matter, { Vector } from "matter-js";

interface BodyProperties {
  position?: Vector;
  inertia?: number;
  velocity?: Vector;
  force?: Vector;
  angle?: number;
  angularVelocity?: number;
}

export const setBodyProperties = (body: Matter.Body, properties: BodyProperties) => {
  const { position, inertia, velocity, force, angle, angularVelocity } = properties;
  if (force) body.force = force;
  if (position) Matter.Body.setPosition(body, position);
  if (velocity) Matter.Body.setVelocity(body, velocity);
};
