import { useEffect } from "react";
import { GameStatus } from "../../../../common";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setTheme, Theme } from "../../redux/slices/ui-slice";
import AlertsHolder from "./alerts/AlertsHolder";
import Navbar from "./navbar";

interface Props {
  children: React.ReactNode;
}

export default function LayoutWithAlerts({ children }: Props) {
  const dispatch = useAppDispatch();
  const lobbyUIState = useAppSelector((state) => state.lobbyUi);
  const { gameStatus } = lobbyUIState.currentGameRoom || { gameStatus: null }; // used to hide navbar in game
  const currentTheme = useAppSelector((state) => state.UI.theme);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === Theme.DEFAULT || theme === Theme.VT320 || theme === Theme.HTML) {
      dispatch(setTheme(theme));
    }
  }, []);

  return (
    <div data-theme={currentTheme} data-theme-type="light" className="app-layout">
      {gameStatus !== GameStatus.IN_PROGRESS && gameStatus !== GameStatus.ENDING && <Navbar />}
      <AlertsHolder />
      <main className="app-layout__main-content">{children}</main>
    </div>
  );
}
