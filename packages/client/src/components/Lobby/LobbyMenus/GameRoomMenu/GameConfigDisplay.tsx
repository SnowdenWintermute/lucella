import React, { useRef } from "react";
import RadioBar from "../../../common-components/RadioBar";
import { BattleRoomGameConfigOptionIndices, BattleRoomGameOptions } from "../../../../../../common";
import useElementIsOverflowing from "../../../../hooks/useElementIsOverflowing";
import useScrollbarSize from "../../../../hooks/useScrollbarSize";

function GameConfigDisplay({
  disabled,
  handleEditOption,
  handleResetToDefaults,
  currentValues,
  extraStyles,
}: {
  disabled: boolean;
  handleEditOption: (optionName: string, newValue: number) => void;
  handleResetToDefaults: () => void;
  currentValues: BattleRoomGameConfigOptionIndices;
  extraStyles?: {
    main?: string;
    columnsContainer?: string;
  };
}) {
  const gameConfigDisplayRef = useRef<HTMLDivElement>(null);
  const isOverflowing = useElementIsOverflowing(gameConfigDisplayRef.current);
  const scrollbarSize = useScrollbarSize();

  const { acceleration, topSpeed, hardBrakingSpeed, turningSpeedModifier, speedIncrementRate } = currentValues;

  return (
    <div className={`game-config-display ${extraStyles?.main ? extraStyles?.main : ""}`} ref={gameConfigDisplayRef}>
      <div
        className={`game-config-display__options ${isOverflowing && scrollbarSize.width && "game-config-display__options--overflow-padding"} ${
          extraStyles?.columnsContainer ? extraStyles?.columnsContainer : ""
        }`}
      >
        <div className="game-config-display__option-column">
          <RadioBar
            title="Acceleration"
            options={BattleRoomGameOptions.acceleration.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={acceleration}
            setValue={(value) => handleEditOption("acceleration", value)}
            disabled={disabled}
            extraStyles="game-config-display__radio-input"
          />
          <RadioBar
            title="Top speed"
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
            title="Turning modifier"
            options={BattleRoomGameOptions.turningSpeedModifier.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={turningSpeedModifier}
            setValue={(value) => handleEditOption("turningSpeedModifier", value)}
            disabled={disabled}
            extraStyles="game-config-display__radio-input"
          />
          <RadioBar
            title="Braking"
            options={BattleRoomGameOptions.hardBrakingSpeed.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={hardBrakingSpeed}
            setValue={(value) => handleEditOption("hardBrakingSpeed", value)}
            disabled={disabled}
            extraStyles="game-config-display__radio-input"
          />
        </div>
        <div className="game-config-display__option-column">
          <RadioBar
            title="Speed increment"
            options={BattleRoomGameOptions.speedIncrementRate.options.map((option, i) => {
              return { title: option.title, value: i };
            })}
            value={speedIncrementRate}
            setValue={(value) => handleEditOption("speedIncrementRate", value)}
            disabled={disabled}
            extraStyles="game-config-display__radio-input"
            tooltip="How much the game speed increases after each point is scored"
          />
        </div>
      </div>
      <button type="button" className="button game-config-display__reset-to-defaults-button" onClick={handleResetToDefaults}>
        RESET TO DEFAULTS
      </button>
    </div>
  );
}

export default GameConfigDisplay;
