import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import BattleRoom from "./battle-room";

const Home: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/battle-room");
  });
  return <BattleRoom />;
};

export default Home;
