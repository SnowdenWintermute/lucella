import React, { useEffect, useState } from "react";
import { BattleRoomGameConfigOptionIndices, SUCCESS_ALERTS } from "../../../../common";
import { Alert } from "../../classes/Alert";
import GameConfigDisplay from "../../components/Lobby/LobbyMenus/GameRoomMenu/GameConfigDisplay";
import { AlertType } from "../../enums";
import { useGetUserBattleRoomGameSettingsQuery, useUpdateBattleRoomGameSettingsMutation } from "../../redux/api-slices/battle-room-game-settings-slice";
import { useAppDispatch } from "../../redux/hooks";
import { setAlert } from "../../redux/slices/alerts-slice";

function BattleRoomGameSettings() {
  const dispatch = useAppDispatch();
  const { data: battleRoomGameSettingsData, isError: battleRoomGameSettingsIsError } = useGetUserBattleRoomGameSettingsQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const [
    updateBattleRoomGameSettings,
    { isLoading: updatedBattleRoomGameSettingsIsLoading, isError: updateBattleRoomGameSettingsIsError, error: updateBattleRoomGameSettingsError },
  ] = useUpdateBattleRoomGameSettingsMutation();

  const [battleRoomGameSettings, setBattleRoomGameSettings] = useState<BattleRoomGameConfigOptionIndices | null>(null);

  useEffect(() => {
    if (battleRoomGameSettingsIsError || !battleRoomGameSettingsData) return;
    const newSettings = new BattleRoomGameConfigOptionIndices({});
    Object.keys(newSettings).forEach((key) => {
      // @ts-ignore
      newSettings[key] = battleRoomGameSettingsData[key];
    });
    setBattleRoomGameSettings(newSettings);
  }, [battleRoomGameSettingsData, battleRoomGameSettingsIsError]);

  useEffect(() => {
    if (!updatedBattleRoomGameSettingsIsLoading && !updateBattleRoomGameSettingsIsError)
      dispatch(setAlert(new Alert(SUCCESS_ALERTS.SETTINGS.BATTLE_ROOM_GAME_SETTINGS_UPDATED, AlertType.SUCCESS)));
  }, [updatedBattleRoomGameSettingsIsLoading, updateBattleRoomGameSettingsIsError]);

  const handleEditOption = (key: string, value: number) => {
    const newOptions = new BattleRoomGameConfigOptionIndices({ ...battleRoomGameSettings });
    // @ts-ignore
    newOptions[key] = value;
    setBattleRoomGameSettings(newOptions);
  };

  return (
    <div className="settings-page__battle-room-game-settings">
      <h3>Casual game options</h3>
      {battleRoomGameSettings && (
        <GameConfigDisplay
          disabled={false}
          handleEditOption={handleEditOption}
          handleResetToDefaults={() => null}
          currentValues={battleRoomGameSettings}
          extraStyles={{
            main: "settings-page__game-config-element",
            columnsContainer: "settings-page__game-config-columns-container",
          }}
          handleSaveOptions={updateBattleRoomGameSettings}
          saveButtonDisabled={updatedBattleRoomGameSettingsIsLoading}
        />
      )}
    </div>
  );
}

export default BattleRoomGameSettings;
