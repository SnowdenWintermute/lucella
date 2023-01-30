import isEqual from "lodash.isequal";
import { BattleRoomGame } from "../../classes/BattleRoomGame";
import { PlayerRole } from "../../enums";
import { DeltasProto, ScoreProto } from "../../proto/generated/src/proto/deltas_pb";
import { determineOrbDeltas } from "./determineOrbDeltas";
import { packOrbSet } from "./packOrbSet";

export function createDeltaPacket(game: BattleRoomGame, playerRole: PlayerRole) {
  if (!game.netcode.prevGameState) return; // send full data // @todo - serialize this in its own protobuf and remove the consistent-renturn eslint disable comment at bottom of file
  const opponentRole = playerRole === PlayerRole.HOST ? PlayerRole.CHALLENGER : PlayerRole.HOST;
  const playerOrbDeltas = determineOrbDeltas(game, playerRole);
  const opponentOrbDeltas = determineOrbDeltas(game, opponentRole, true);

  const deltasPacket = new DeltasProto();
  let packedHostOrbs;
  let packedChallengerOrbs;
  if (playerOrbDeltas && Object.keys(playerOrbDeltas).length)
    if (playerRole === PlayerRole.HOST) packedHostOrbs = packOrbSet(playerOrbDeltas);
    else packedChallengerOrbs = packOrbSet(playerOrbDeltas);
  if (opponentOrbDeltas && Object.keys(opponentOrbDeltas).length)
    if (opponentRole === PlayerRole.HOST) packedHostOrbs = packOrbSet(opponentOrbDeltas);
    else packedChallengerOrbs = packOrbSet(opponentOrbDeltas);

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

  // eslint-disable-next-line consistent-return
  return serializedMessage;
}
