import { GameStatus } from "../../../../common";
import { useAppSelector } from "../../redux/hooks";
import AlertsHolder from "./alerts/AlertsHolder";
import ContextMenuDismissalClickListener from "./context-menu/ContextMenuDismissalClickListener";
import GlobalModals from "./global-modals/GlobalModals";
import Navbar from "./navbar";

interface Props {
  children: React.ReactNode;
}

export default function LayoutWithHeaderAndAlerts({ children }: Props) {
  const lobbyUIState = useAppSelector((state) => state.lobbyUi);
  const { gameStatus } = lobbyUIState.currentGameRoom || { gameStatus: null }; // used to hide navbar in game

  return (
    <>
      {gameStatus !== GameStatus.IN_PROGRESS && gameStatus !== GameStatus.ENDING && <Navbar />}
      <AlertsHolder />
      <ContextMenuDismissalClickListener />
      <GlobalModals />
      <main>{children}</main>
    </>
  );
}
