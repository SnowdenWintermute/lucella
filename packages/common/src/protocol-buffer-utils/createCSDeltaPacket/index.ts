import { CSGameState } from "../../classes/CombatSimulator/CSGameState";
import { EntityProto, Vec3Proto, EntitiesProto, GameStateProto } from "../../proto/generated/src/proto/cs-game-state-deltas_pb";

export function packCSGameStateDeltas(deltasToSerialize: Partial<CSGameState>) {
  const packet = new GameStateProto();
  if (deltasToSerialize.entities) {
    const playerControlled = new EntitiesProto();
    // packet.setMobileentities(new EntitiesProto())
    Object.entries(deltasToSerialize.entities.playerControlled).forEach(([id, entity], i) => {
      const entityProto = playerControlled.addEntities();
      const entityPosition = new Vec3Proto();
      entityPosition.setX(entity.body.position.x);
      entityPosition.setY(entity.body.position.y);
      entityPosition.setZ(entity.z);
      entityProto.setPosition(entityPosition);
      entityProto.setId(id);
    });
  }

  return packet;
}
