import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLadderPage } from "../../../store/actions/ladder";

const Ladder = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLadderPage(1));
  }, []);

  return (
    <div className="page-basic">
      <h1 className="header-basic">LADDER</h1>
    </div>
  );
};

export default Ladder;
