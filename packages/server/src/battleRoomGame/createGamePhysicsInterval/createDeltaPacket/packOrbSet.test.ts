import { createTestGameWithPrevGameState } from "./determineOrbDeltas.test";
import { OrbsProto, PlayerRole } from "@lucella/common";
import determineOrbDeltas from "./determineOrbDeltas";
import packOrbSet from "./packOrbSet";

test("pack and unpack orb deltas and be able to know if a field was not set", () => {
  const game = createTestGameWithPrevGameState();
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-0"].isGhost = true;
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-1"].isGhost = true;
  game.netcode.prevGameState!.orbs.challenger["challenger-orb-2"].isSelected = true;
  const playerOrbDeltas = determineOrbDeltas(game, PlayerRole.CHALLENGER);
  let packedOrbs;
  if (playerOrbDeltas && Object.keys(playerOrbDeltas).length) packedOrbs = packOrbSet(playerOrbDeltas);
  const serializedMessage = packedOrbs?.serializeBinary();
  const deserializedMessage = OrbsProto.deserializeBinary(serializedMessage!);
  const orbList = deserializedMessage.getOrbsList();
  expect(orbList[0].getId()).toBe(0);
  expect(orbList[1].getId()).toBe(1);
  expect(orbList[1].hasIsselected()).toBe(false);
  expect(orbList[1].hasIsghost()).toBe(true);
  expect(orbList[1].getIsghost()).toBe(false);
  expect(orbList[2].getId()).toBe(2);
  expect(orbList[2].hasIsselected()).toBe(true);
  expect(orbList[2].hasIsghost()).toBe(false);
  expect(orbList[2].getIsselected()).toBe(false);
});
