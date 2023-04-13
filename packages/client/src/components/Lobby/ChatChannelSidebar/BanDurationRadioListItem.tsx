import React from "react";

export function BanDurationRadioListItem({
  title,
  duration,
  setBanDuration,
  checked,
}: {
  title: string;
  duration: number | null;
  setBanDuration: (duration: number | null) => void;
  checked: boolean;
}) {
  return (
    <li className={`ban-modal__radio-button-li ${!checked && "ban-modal__radio-button-li--unchecked"}`}>
      <button type="button" className="button" onClick={() => setBanDuration(duration)}>
        {title}
      </button>
    </li>
  );
}
