import { GameStatus } from "../../../../common";
import { useAppSelector } from "../../redux/hooks";
import AlertsHolder from "./alerts/AlertsHolder";
import Navbar from "./navbar";

interface Props {
  children: React.ReactNode;
}

export default function LayoutWithAlerts({ children }: Props) {
  const lobbyUIState = useAppSelector((state) => state.lobbyUi);
  const { gameStatus } = lobbyUIState.currentGameRoom || { gameStatus: null }; // used to hide navbar in game

  return (
    <>
      {gameStatus !== GameStatus.IN_PROGRESS && gameStatus !== GameStatus.ENDING && <Navbar />}
      <AlertsHolder />
      <main data-theme="vt">{children}</main>
      {/* <main data-theme="vt">{children}</main> */}
    </>
  );
}
