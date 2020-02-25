import React from "react";
import { Link } from "react-router-dom";

const Games = props => {
  return (
    <div className="page-basic">
      <h1 className="header-basic">GAMES</h1>
      <Link to="/battle-room">Battle Room</Link>
    </div>
  );
};

export default Games;
