import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import BattleRoom from "./battle-room";

// eslint-disable-next-line react/function-component-definition
const Home: NextPage = () => {
  // const router = useRouter();
  // useEffect(() => {
  //   router.push("/battle-room");
  // });
  return <BattleRoom />;
};

export default Home;
