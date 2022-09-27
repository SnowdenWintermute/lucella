import React, { useState, Fragment, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserMenu } from "./UserMenu";
import logo from "../../../img/logo.png";
import { ReactComponent as GamesIcon } from "../../../img/menuIcons/queen.svg";
import { ReactComponent as LadderIcon } from "../../../img/menuIcons/podium.svg";
import { RootState } from "../../../store";
import { History } from "history";
import { GameStatus } from "../common/src/enums";

const Navbar = () => {
  const history: History = useHistory();
  const [activeTab, setActiveTab] = useState<string>(history.location.toString());
  const authState = useSelector((state: RootState) => state.auth.isAuthenticated);
  const { isAuthenticated, loading } = authState;
  const gameUiState = useSelector((state: RootState) => state.gameUi);
  const { gameStatus } = gameUiState; // used to hide navbar in game

  useEffect(() => {
    setActiveTab(history.location.pathname);
  }, [history.location.pathname]);

  return (
    gameStatus !== GameStatus.IN_PROGRESS &&
    gameStatus !== GameStatus.ENDING && (
      <Fragment>
        <nav className="nav">
          {/* Nav tabs */}
          <div className="nav-right-holder">
            <img className="logo-img" alt="lucella logo" src={logo} />
            <Link to="/" className="brand-text">
              <h1>Lucella.org</h1>
            </Link>
            <div className="nav-tabs">
              <Link
                to="/battle-room"
                className={`nav-tab ${activeTab === "/battle-room" && "tab-active"}`}
                onClick={() => setActiveTab("/battle-room")}
              >
                <span className="tab-title-text">GAME</span>
                <GamesIcon className="tab-icon-svg" />
              </Link>
              <Link
                to="/ladder"
                className={`nav-tab ${activeTab === "/ladder" && "tab-active"}`}
                onClick={() => setActiveTab("/ladder")}
              >
                <span className="tab-title-text">LADDER</span>
                <LadderIcon className="tab-icon-svg" />
              </Link>
            </div>
          </div>
          {/* User menu */}
          <div className="user-menu-holder">{!loading ? <UserMenu isAuthenticated={isAuthenticated} /> : "..."}</div>
        </nav>
        <div className="nav-tab-thin-bar"></div>
      </Fragment>
    )
  );
};

export default Navbar;
