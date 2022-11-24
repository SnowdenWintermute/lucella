import isEqual from "lodash.isequal";
import { BattleRoomGame, PlayerRole, DeltasProto, ScoreProto } from "../../../../../../common";
import determineOrbDeltas from "./determineOrbDeltas";
import packOrbSet from "./packOrbSet";

export default function (game: BattleRoomGame, playerRole: PlayerRole) {
  if (!game.netcode.prevGameState) return; // send full data
  const opponentRole = playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;
  const playerOrbDeltas = determineOrbDeltas(game, playerRole);
  const opponentOrbDeltas = determineOrbDeltas(game, opponentRole, true);

  let deltasPacket = new DeltasProto();
  let packedHostOrbs, packedChallengerOrbs;
  if (playerOrbDeltas && Object.keys(playerOrbDeltas).length)
    playerRole === PlayerRole.HOST ? (packedHostOrbs = packOrbSet(playerOrbDeltas)) : (packedChallengerOrbs = packOrbSet(playerOrbDeltas));
  if (opponentOrbDeltas && Object.keys(opponentOrbDeltas).length)
    opponentRole === PlayerRole.HOST ? (packedHostOrbs = packOrbSet(opponentOrbDeltas)) : (packedChallengerOrbs = packOrbSet(opponentOrbDeltas));

  deltasPacket.setHostorbs(packedHostOrbs);
  deltasPacket.setChallengerorbs(packedChallengerOrbs);

  if (!isEqual(game.score, game.netcode.prevGameState.score)) {
    const packedScore = new ScoreProto();
    if (game.score.host !== game.netcode.prevGameState.score.host) packedScore.setHost(game.score.host);
    if (game.score.challenger !== game.netcode.prevGameState.score.challenger) packedScore.setChallenger(game.score.challenger);
    if (game.score.neededToWin !== game.netcode.prevGameState.score.neededToWin) packedScore.setNeededtowin(game.score.neededToWin);
    deltasPacket.setScore(packedScore);
  }
  if (game.speedModifier !== game.netcode.prevGameState.speedModifier) deltasPacket.setGamespeedmodifier(game.speedModifier);

  deltasPacket.setServerlastprocessedinputnumber(game.netcode.serverLastProcessedInputNumbers[playerRole]);

  const serializedMessage = deltasPacket.serializeBinary();
  // console.log("length in bytes: " + serializedMessage.length);
  return serializedMessage;
}
