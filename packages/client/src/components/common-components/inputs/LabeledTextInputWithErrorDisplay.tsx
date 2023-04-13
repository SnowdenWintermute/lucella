import React from "react";

type Props = {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: any) => void;
  disabled: boolean;
  error: string;
  autofocus: boolean;
  extraStyles?: string;
  dataCy?: string;
};

function LabeledTextInputWithErrorDisplay({
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  disabled,
  error,
  autofocus,
  extraStyles = "",
  dataCy = "",
}: Props) {
  return (
    <label htmlFor={name} className={extraStyles}>
      <p className={`labeled-input__label ${error && "labeled-input__label--red-text"}`}>
        {label}
        {error && (
          <span id="error" role="alert" data-cy={`error-${name}`} className="labeled-input__label--red-text">
            {` - ${error}`}
          </span>
        )}
      </p>
      <input
        className={`input input--transparent ${error && "labeled-input--red-border"} ${extraStyles}`}
        aria-label={name}
        type={type}
        placeholder={placeholder}
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e)}
        disabled={disabled}
        autoFocus={autofocus}
        aria-invalid={!!error}
        data-cy={dataCy}
      />
    </label>
  );
}

export default LabeledTextInputWithErrorDisplay;
