import React, { useEffect, useRef, useState } from "react";
import { BattleRoomGameConfigOptionIndices, BattleRoomGameConfigOptionIndicesUpdate, SUCCESS_ALERTS } from "../../../../common";
import { Alert } from "../../classes/Alert";
import LoadingSpinner from "../../components/common-components/LoadingSpinner";
import GameConfigDisplay from "../../components/Lobby/LobbyMenus/GameRoomMenu/GameConfigDisplay";
import { AlertType } from "../../enums";
import {
  useGetUserBattleRoomGameSettingsQuery,
  useResetBattleRoomGameSettingsMutation,
  useUpdateBattleRoomGameSettingsMutation,
} from "../../redux/api-slices/battle-room-game-settings-slice";
import { useAppDispatch } from "../../redux/hooks";
import { setAlert } from "../../redux/slices/alerts-slice";

function BattleRoomGameSettings() {
  const dispatch = useAppDispatch();
  const { data: battleRoomGameSettingsData, isError: battleRoomGameSettingsIsError } = useGetUserBattleRoomGameSettingsQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const [
    updateBattleRoomGameSettings,
    { isLoading: updatedBattleRoomGameSettingsIsLoading, isError: updateBattleRoomGameSettingsIsError, isSuccess: updateBattleRoomGameSettingsIsSuccess },
  ] = useUpdateBattleRoomGameSettingsMutation();
  const [
    resetBattleRoomGameSettings,
    { isLoading: resetBattleRoomGameSettingsIsLoading, isError: resetBattleRoomGameSettingsIsError, isSuccess: resetBattleRoomGameSettingsIsSuccess },
  ] = useResetBattleRoomGameSettingsMutation();

  const [battleRoomGameSettings, setBattleRoomGameSettings] = useState<BattleRoomGameConfigOptionIndices | null>(null);
  const [newValuesToSaveExist, setNewValuesToSaveExist] = useState(false);
  const [resetToDefaultsDisabled, setResetToDefaultsDisabled] = useState(false);
  const newValuesToSave = useRef<BattleRoomGameConfigOptionIndicesUpdate>({});

  useEffect(() => {
    if (battleRoomGameSettingsIsError || !battleRoomGameSettingsData) return;
    const newSettings = new BattleRoomGameConfigOptionIndices({});
    Object.keys(newSettings).forEach((key) => {
      newSettings[key as keyof typeof newSettings] = battleRoomGameSettingsData[key as keyof typeof battleRoomGameSettings];
    });
    setBattleRoomGameSettings(newSettings);
  }, [battleRoomGameSettingsData, battleRoomGameSettingsIsError]);

  useEffect(() => {
    if (!updatedBattleRoomGameSettingsIsLoading && updateBattleRoomGameSettingsIsSuccess) {
      dispatch(setAlert(new Alert(SUCCESS_ALERTS.SETTINGS.BATTLE_ROOM_GAME_SETTINGS_UPDATED, AlertType.SUCCESS)));
    }
  }, [updatedBattleRoomGameSettingsIsLoading, updateBattleRoomGameSettingsIsError]);

  const handleEditOption = (key: string, value: number) => {
    const newOptions = new BattleRoomGameConfigOptionIndices({ ...battleRoomGameSettings });
    if (newOptions[key as keyof typeof newOptions] !== value) setNewValuesToSaveExist(true);
    // @ts-ignore
    newOptions[key] = value;
    setBattleRoomGameSettings(newOptions);
    newValuesToSave.current[key as keyof typeof newValuesToSave.current] = value;
    setResetToDefaultsDisabled(false);
  };

  const handleSaveOptions = () => {
    updateBattleRoomGameSettings(newValuesToSave.current);
    newValuesToSave.current = {};
    setNewValuesToSaveExist(false);
  };

  const sendResetToDefaultsRequest = () => {
    setNewValuesToSaveExist(false);
    setResetToDefaultsDisabled(true);
    resetBattleRoomGameSettings(null);
  };

  useEffect(() => {
    if (!resetBattleRoomGameSettingsIsLoading && resetBattleRoomGameSettingsIsSuccess) {
      setBattleRoomGameSettings(new BattleRoomGameConfigOptionIndices({}));
      dispatch(setAlert(new Alert(SUCCESS_ALERTS.SETTINGS.BATTLE_ROOM_GAME_SETTINGS_RESET, AlertType.SUCCESS)));
    }
  }, [resetBattleRoomGameSettingsIsLoading, resetBattleRoomGameSettingsIsError]);

  return (
    <div className="settings-page__battle-room-game-settings">
      <h3>Casual game options</h3>
      {!battleRoomGameSettings && <LoadingSpinner />}
      {battleRoomGameSettings && (
        <GameConfigDisplay
          disabled={false}
          handleEditOption={handleEditOption}
          handleResetToDefaults={sendResetToDefaultsRequest}
          currentValues={battleRoomGameSettings}
          extraStyles={{
            main: "settings-page__game-config-element",
            columnsContainer: "settings-page__game-config-columns-container",
          }}
          handleSaveOptions={handleSaveOptions}
          saveButtonDisabled={updatedBattleRoomGameSettingsIsLoading || !newValuesToSaveExist}
          resetToDefaultsButtonDisabled={resetBattleRoomGameSettingsIsLoading || resetToDefaultsDisabled}
        />
      )}
    </div>
  );
}

export default BattleRoomGameSettings;
