/* eslint-disable consistent-return */
import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { CSEventsFromServer } from "../../../../common";
import unpackCSGameStateDeltas from "../../protobuf-utils/combat-simulator-proto-utils/unpackDeltas";

export function CombatSimulatorListener({ socket }: { socket: Socket }) {
  useEffect(() => {
    if (!socket) return;
    socket.on(CSEventsFromServer.CS_GAME_PACKET, async (data: Uint8Array) => {
      unpackCSGameStateDeltas(data);
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
