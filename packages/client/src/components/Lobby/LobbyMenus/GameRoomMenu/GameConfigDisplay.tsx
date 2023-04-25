import React, { useEffect, useRef, useState } from "react";
import RadioBar from "../../../common-components/RadioBar";
import { BattleRoomGameConfigOptionIndices, BattleRoomGameOptions } from "../../../../../../common";
import useElementIsOverflowing from "../../../../hooks/useElementIsOverflowing";
import useScrollbarSize from "../../../../hooks/useScrollbarSize";
import { BUTTON_NAMES } from "../../../../consts/button-names";

function GameConfigDisplay({
  disabled,
  handleEditOption,
  handleResetToDefaults,
  currentValues,
  extraStyles,
  handleSaveOptions,
  saveButtonDisabled,
  resetToDefaultsButtonDisabled,
}: {
  disabled: boolean;
  handleEditOption: (optionName: string, newValue: number) => void;
  handleResetToDefaults: () => void;
  currentValues: BattleRoomGameConfigOptionIndices;
  extraStyles?: {
    main?: string;
    columnsContainer?: string;
  };
  handleSaveOptions?: (newValues: BattleRoomGameConfigOptionIndices) => void;
  saveButtonDisabled?: boolean;
  resetToDefaultsButtonDisabled?: boolean;
}) {
  const gameConfigDisplayRef = useRef<HTMLDivElement>(null);
  const isOverflowing = useElementIsOverflowing(gameConfigDisplayRef.current);
  const scrollbarSize = useScrollbarSize();
  const [usingDefaultSettings, setUsingDefaultSettings] = useState(true);

  const { acceleration, topSpeed, hardBrakingSpeed, turningSpeedModifier, speedIncrementRate, numberOfRoundsRequiredToWin } = currentValues;

  useEffect(() => {
    let valuesAreDefault = true;
    let i = 0;
    const keys = Object.keys(currentValues);
    while (i < keys.length && valuesAreDefault) {
      // @ts-ignore
      if (currentValues[keys[i]] !== BattleRoomGameOptions[keys[i]].defaultIndex) valuesAreDefault = false;
      i += 1;
    }
    setUsingDefaultSettings(valuesAreDefault);
  }, [currentValues]);

  return (
    <div className={`game-config-display ${extraStyles?.main ? extraStyles?.main : ""}`} ref={gameConfigDisplayRef}>
      <div
        className={`game-config-display__options ${isOverflowing && scrollbarSize.width && "game-config-display__options--overflow-padding"} ${
          extraStyles?.columnsContainer ? extraStyles?.columnsContainer : ""
        }`}
      >
        <div className="game-config-display__option-column">
          <RadioBar
            title={BattleRoomGameOptions.acceleration.readableTitle}
            options={BattleRoomGameOptions.acceleration.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={acceleration}
            setValue={(value) => handleEditOption("acceleration", value)}
            disabled={disabled}
            extraStyles="game-config-display__radio-input"
          />
          <RadioBar
            title={BattleRoomGameOptions.topSpeed.readableTitle}
            options={BattleRoomGameOptions.topSpeed.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={topSpeed}
            setValue={(value) => handleEditOption("topSpeed", value)}
            disabled={disabled}
            extraStyles="game-config-display__radio-input"
          />
        </div>
        <div className="game-config-display__option-column">
          <RadioBar
            title={BattleRoomGameOptions.turningSpeedModifier.readableTitle}
            options={BattleRoomGameOptions.turningSpeedModifier.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={turningSpeedModifier}
            setValue={(value) => handleEditOption("turningSpeedModifier", value)}
            disabled={disabled}
            extraStyles="game-config-display__radio-input"
            tooltip="Additional acceleration to assist an orb in countering momentum in a direction other than its destination"
          />
          <RadioBar
            title={BattleRoomGameOptions.hardBrakingSpeed.readableTitle}
            options={BattleRoomGameOptions.hardBrakingSpeed.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={hardBrakingSpeed}
            setValue={(value) => handleEditOption("hardBrakingSpeed", value)}
            disabled={disabled}
            extraStyles="game-config-display__radio-input"
            tooltip="How quickly orbs come to a stop after reaching their destinations"
          />
        </div>
        <div className="game-config-display__option-column">
          <RadioBar
            title={BattleRoomGameOptions.speedIncrementRate.readableTitle}
            options={BattleRoomGameOptions.speedIncrementRate.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={speedIncrementRate}
            setValue={(value) => handleEditOption("speedIncrementRate", value)}
            disabled={disabled}
            extraStyles="game-config-display__radio-input"
            tooltip="How much the game speed increases after each point is scored"
          />
          <RadioBar
            title={BattleRoomGameOptions.numberOfRoundsRequiredToWin.readableTitle}
            options={BattleRoomGameOptions.numberOfRoundsRequiredToWin.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={numberOfRoundsRequiredToWin}
            setValue={(value) => handleEditOption("numberOfRoundsRequiredToWin", value)}
            disabled={disabled}
            extraStyles="game-config-display__radio-input"
            tooltip="Number of rounds required to win the match"
          />
        </div>
      </div>
      <div className="game-config-display__bottom-buttons">
        <button
          type="button"
          className="button game-config-display__reset-to-defaults-button"
          onClick={handleResetToDefaults}
          disabled={usingDefaultSettings || resetToDefaultsButtonDisabled}
        >
          {BUTTON_NAMES.GAME_CONFIG.RESET_TO_DEFAULTS}
        </button>
        {handleSaveOptions && (
          <button
            type="button"
            disabled={saveButtonDisabled}
            className="button game-config-display__reset-to-defaults-button"
            onClick={() => handleSaveOptions(currentValues)}
          >
            {BUTTON_NAMES.GAME_CONFIG.SAVE}
          </button>
        )}
      </div>
    </div>
  );
}

export default GameConfigDisplay;
