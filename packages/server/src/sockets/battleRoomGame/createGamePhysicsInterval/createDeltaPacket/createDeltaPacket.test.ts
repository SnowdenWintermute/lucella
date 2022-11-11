import { createTestGameWithPrevGameState } from "./determineOrbDeltas.test";
import { DeltasProto, PlayerRole, Point } from "../../../../../../common";
import createDeltaPacket from "./createDeltaPacket";
import { baseSpeedModifier } from "@lucella/common/src/consts/battle-room-game-config";

test("delta packet doesn't contain destinations of opponent orbs", () => {
  const game = createTestGameWithPrevGameState();

  game.orbs.challenger["challenger-orb-0"].destination = new Point(1, 2);
  game.orbs.host["host-orb-0"].destination = new Point(1, 2);

  const deltaPacketForHost = createDeltaPacket(game, PlayerRole.HOST);
  const deserializedMessage = DeltasProto.deserializeBinary(deltaPacketForHost!);

  expect(deserializedMessage.getHostorbs()?.getOrbsList()[0].getDestination()?.toObject()).toStrictEqual({ x: 1, y: 2 });
  expect(deserializedMessage.getChallengerorbs()?.getOrbsList()[0].getDestination()?.toObject()).toBe(undefined);
});

test("delta packet basic fields serialize and deserialize and can be recognized as not defined", () => {
  const game = createTestGameWithPrevGameState();
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-0"].body.position = new Point(1, 2);
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-1"].isSelected = true;
  game.netcode.prevGameState!.speedModifier = baseSpeedModifier + 1;
  const deltaPacketForHost = createDeltaPacket(game, PlayerRole.HOST);
  const deserializedMessage = DeltasProto.deserializeBinary(deltaPacketForHost!);

  expect(deserializedMessage.hasScore()).toBe(false);
  expect(deserializedMessage.hasGamespeedmodifier()).toBe(true);
  expect(deserializedMessage.hasServerlastprocessedinputnumbers()).toBe(true); // always gets sent
});
