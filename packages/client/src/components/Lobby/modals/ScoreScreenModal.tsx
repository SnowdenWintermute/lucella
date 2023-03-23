import React from "react";
import { usersApi } from "../../../redux/api-slices/users-api-slice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setShowScoreScreenModal } from "../../../redux/slices/ui-slice";
import Modal from "../../common-components/Modal";

export default function ScoreScreenModal() {
  const dispatch = useAppDispatch();
  const scoreScreenData = useAppSelector((state) => state.lobbyUi.scoreScreenData);
  const guestUsername = useAppSelector((state) => state.lobbyUi.guestUsername);
  const user = usersApi.endpoints.getMe.useQueryState(null, { selectFromResult: ({ data }) => data! });

  const setParentDisplay = (isDisplayed: boolean) => {
    dispatch(setShowScoreScreenModal(isDisplayed));
  };

  if (!scoreScreenData || !scoreScreenData.gameRoom || !scoreScreenData.gameRecord)
    return (
      <Modal title="Score Screen" setParentDisplay={setParentDisplay} backdropStyle="">
        <span>Error - no score screen data received</span>
      </Modal>
    );

  const { gameRoom, gameRecord } = scoreScreenData;
  const firstOrSecondPlayer = gameRoom.players.challenger!.associatedUser.username === user?.name ? "second" : "first";

  const playerPreGameElo = gameRecord[`${firstOrSecondPlayer}PlayerPreGameElo`];
  const playerPostGameElo = gameRecord[`${firstOrSecondPlayer}PlayerPostGameElo`];
  const playerPreGameRank = gameRecord[`${firstOrSecondPlayer}PlayerPreGameRank`];
  const playerPostGameRank = gameRecord[`${firstOrSecondPlayer}PlayerPostGameRank`];

  const eloDiff = playerPostGameElo - playerPreGameElo;

  const wasRanked = !!gameRecord.firstPlayerPostGameElo;
  let wasVictory = false;
  if (user && user.name === gameRoom.winner) wasVictory = true;
  else if (!playerPreGameRank && guestUsername === gameRoom.winner) wasVictory = true;

  // eslint-disable-next-line no-nested-ternary
  const eloDiffSign = eloDiff ? (wasVictory ? "+" : "") : null;
  const eloTextAnimation = wasVictory ? "score-screen-modal__elo--animate-gain" : "score-screen-modal__elo--animate-loss";

  return (
    <Modal title={`Game ${gameRoom.gameName} result`} setParentDisplay={setParentDisplay} extraStyles="score-screen-modal" noPadding>
      <div className="score-screen-modal__contents" data-cy="score-screen-modal">
        <div className="score-screen-modal__left">
          <div className="score-screen-modal__player-name-and-score">
            <div>{gameRoom.players.host?.associatedUser.username}</div>
            <div>{gameRecord.firstPlayerScore}</div>
          </div>
          <span>vs.</span>
          <div className="score-screen-modal__player-name-and-score">
            <div>{gameRoom.players.challenger?.associatedUser.username}</div>
            <div>{gameRecord.secondPlayerScore}</div>
          </div>
        </div>
        <div className="score-screen-modal__right">
          <div className="score-screen-modal__game-result">
            {wasVictory ? "Victory" : "Defeat"}
            {!Number.isNaN(eloDiff) && (
              <span className="score-screen-modal__elo-diff">
                {eloDiffSign}
                {eloDiff}
              </span>
            )}
          </div>
          <div className="score-screen-modal__elo-and-rank-changes">
            {!wasRanked && <div className="score-screen-modal__elo-and-rank-changes-block">No changes to ladder rating</div>}
            {wasRanked && (
              <>
                <div className="score-screen-modal__elo-and-rank-changes-block">
                  <div className={eloTextAnimation}>Elo</div>
                  <div className={eloTextAnimation}>
                    {playerPreGameElo} → {playerPostGameElo}
                  </div>
                </div>
                <div className="score-screen-modal__elo-and-rank-changes-block">
                  <div>Rank</div>
                  <div>
                    {playerPreGameRank} → {playerPostGameRank}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
