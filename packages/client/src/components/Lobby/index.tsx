import { Socket } from "socket.io-client";
import React from "react";
import Chat from "./Chat";
import LobbyMenus from "./LobbyMenus";
import ChatChannelSidebar from "./ChatChannelSidebar";
import { useAppSelector } from "../../redux/hooks";
import { useGetMeQuery } from "../../redux/api-slices/users-api-slice";
import styles from "./lobby.module.scss";
import ScoreScreenModal from "./modals/ScoreScreenModal";

function Lobby({ socket }: { socket: Socket }) {
  const { data: user } = useGetMeQuery(null, { refetchOnMountOrArgChange: true }); // not using the data but we are re calling the quuery to update cache for other components like navbar/usermenu
  const uiState = useAppSelector((state) => state.UI);

  return (
    <main className={`page ${styles["lobby"]}`}>
      <div className={styles["lobby__menus-and-chat"]}>
        {uiState.modals.scoreScreen && <ScoreScreenModal />}
        <LobbyMenus socket={socket} />
        <Chat socket={socket} />
      </div>
      <ChatChannelSidebar />
    </main>
  );
}

export default Lobby;
