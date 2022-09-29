import { useRouter } from "next/router";
import Link from "next/link";
import { UserMenu } from "./UserMenu";
import logo from "../../../img/logo.png";
import GamesIcon from "../../../img/menuIcons/queen.svg";
import LadderIcon from "../../../img/menuIcons/podium.svg";
import { useAppSelector } from "../../../redux";
import { GameStatus } from "../../../../common";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const lobbyUIState = useAppSelector((state) => state.lobbyUi);
  const { gameStatus } = lobbyUIState.currentGameRoom || { gameStatus: null }; // used to hide navbar in game

  if (gameStatus === GameStatus.IN_PROGRESS || gameStatus === GameStatus.ENDING) return <></>;

  return (
    <>
      <nav className="nav">
        {/* Nav tabs */}
        <div className="nav-right-holder">
          <Image className="logo-img" alt="lucella logo" src={logo} />
          <Link href="/">
            <a className="brand-text">
              <h1>Lucella.org</h1>
            </a>
          </Link>
          <div className="nav-tabs">
            <Link href="/battle-room">
              <a className={`nav-tab ${router.pathname === "/battle-room" && "tab-active"}`}>
                <span className="tab-title-text">GAME</span>
                <GamesIcon className="tab-icon-svg" />
              </a>
            </Link>
            <Link href="/ladder">
              <a className={`nav-tab ${router.pathname === "/ladder" && "tab-active"}`}>
                <span className="tab-title-text">LADDER</span>
                <LadderIcon className="tab-icon-svg" />
              </a>
            </Link>
          </div>
        </div>
        {/* User menu */}
        <div className="user-menu-holder">{!loading ? <UserMenu /> : "..."}</div>
      </nav>
      <div className="nav-tab-thin-bar"></div>
    </>
  );
};

export default Navbar;
