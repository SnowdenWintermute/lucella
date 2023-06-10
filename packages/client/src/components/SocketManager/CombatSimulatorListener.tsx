/* eslint-disable consistent-return */
import React, { useEffect } from "react";
import { Socket } from "socket.io-client";
import { Scene } from "@babylonjs/core";
import { CSEventsFromServer, CombatSimulator } from "../../../../common";
import unpackCSGameStateDeltas from "../../protobuf-utils/combat-simulator-proto-utils/unpackDeltas";
import { mapUnpackedCSDeltasToCSObject } from "../../protobuf-utils/combat-simulator-proto-utils/mapUnpackedCSDeltasToCSObject";

export function CombatSimulatorListener({ socket, cs }: { socket: Socket; cs: CombatSimulator }) {
  useEffect(() => {
    if (!socket) return;
    socket.on(CSEventsFromServer.CS_GAME_PACKET, async (data: Uint8Array) => {
      const unpacked = unpackCSGameStateDeltas(data);
      mapUnpackedCSDeltasToCSObject(unpacked, cs);
    });

    return () => {
      socket.off(CSEventsFromServer.CS_GAME_PACKET);
    };
  }, [socket]);

  return <div id="socket-listener-for-combat-simulator" />;
}
