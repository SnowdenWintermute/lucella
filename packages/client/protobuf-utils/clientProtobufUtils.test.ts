import "jest";
import { createDeltaPacket, createTestGameWithPrevGameState, PlayerRole, Point } from "../../common";
import mapUnpackedPacketToUpdateObject from "./mapUnpackedPacketToUpdateObject";
import unpackDeltaPacket from "./unpackDeltaPacket";

describe("client protobuf utils", () => {
  const game = createTestGameWithPrevGameState();
  let unpacked;

  beforeEach(() => {
    game.orbs.host["host-orb-1"].isGhost = true;
    game.orbs.host["host-orb-2"].body.position = new Point(1, 2);
    game.orbs.host["host-orb-3"].isSelected = true;
    const deltaPacket = createDeltaPacket(game, PlayerRole.HOST);

    unpacked = unpackDeltaPacket(deltaPacket!, PlayerRole.HOST);
  });

  it("unpackDeltaPacket unpacks the packet correctly", () => {
    console.log(JSON.stringify(unpacked, null, 2));
    const hostOrbs = unpacked!.orbs!.host;
    expect(hostOrbs!["host-orb-1"].isGhost).toBe(true);
    expect(hostOrbs!["host-orb-2"].position).toEqual({ x: 1, y: 2 });
    expect(hostOrbs!["host-orb-3"].isSelected).toBe(true);
  });

  it("mapUnpackedPacketToUpdate maps the unpacked packet to update object correctly", () => {
    const prevGameStateWithDeltas = mapUnpackedPacketToUpdateObject(game, unpacked);
    expect(prevGameStateWithDeltas.orbs.host["host-orb-1"].isGhost).toBe(true);
    expect(prevGameStateWithDeltas.orbs.host["host-orb-1"].isSelected).toBe(false);
    expect(prevGameStateWithDeltas.orbs.host["host-orb-2"].body.position).toEqual({ x: 1, y: 2 });
    expect(prevGameStateWithDeltas.orbs.host["host-orb-3"].isSelected).toBe(true);
  });
});
