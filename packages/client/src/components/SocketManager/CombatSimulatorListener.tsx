/* eslint-disable consistent-return */
import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { CSEventsFromServer, CombatSimulator } from "../../../../common";
import unpackCSGameStateDeltas from "../../protobuf-utils/combat-simulator-proto-utils/unpackDeltas";
import { mapUnpackedCSDeltasToCSObject } from "../../protobuf-utils/combat-simulator-proto-utils/mapUnpackedCSDeltasToCSObject";

export function CombatSimulatorListener({ socket, cs }: { socket: Socket; cs: CombatSimulator }) {
  useEffect(() => {
    if (!socket) return;
    socket.on(CSEventsFromServer.CS_GAME_PACKET, async (data: Uint8Array) => {
      const unpacked = unpackCSGameStateDeltas(data);
      const updated = mapUnpackedCSDeltasToCSObject(unpacked, cs);
      console.log(updated);
      // if (!playerRole) return console.log("failed to accept a delta update from server because no player role was assigned");
      // const unpacked = unpackDeltaPacket(data, playerRole);
      // const prevGameStateWithDeltas = mapUnpackedPacketToUpdateObject(game, unpacked);
      // game.netcode.lastUpdateFromServer = prevGameStateWithDeltas;
      // game.netcode.timeLastUpdateReceived = +Date.now();
    });

    return () => {
      socket.off(CSEventsFromServer.CS_GAME_PACKET);
    };
  }, [socket]);

  return <div id="socket-listener-for-combat-simulator" />;
}
