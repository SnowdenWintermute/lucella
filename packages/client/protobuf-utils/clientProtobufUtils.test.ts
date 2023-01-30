import { createDeltaPacket, createTestGameWithPrevGameState, PlayerRole, Point } from "../../common";
import unpackDeltaPacket from "./unpackDeltaPacket";

describe("unpackDeltaPacket", () => {
  it("unpacks the packet correctly", () => {
    const game = createTestGameWithPrevGameState();
    game.orbs.host["host-orb-1"].isGhost = true;
    game.orbs.host["host-orb-2"].body.position = new Point(1, 2);
    game.orbs.host["host-orb-3"].isSelected = true;
    const deltaPacket = createDeltaPacket(game, PlayerRole.HOST);

    const unpacked = unpackDeltaPacket(deltaPacket!, PlayerRole.HOST);
    console.log(JSON.stringify(unpacked, null, 2));
  });
});
