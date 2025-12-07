import React from "react";

export type Option = { value: string | number; label: string };

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options?: Option[];
  error?: string | null;
  containerClassName?: string;
};

export default function Select({
  label,
  options = [],
  error,
  containerClassName,
  children,
  ...rest
}: SelectProps) {
  return (
    <div className={containerClassName ? containerClassName : "mb-3"}>
      {label && <label className="form-label">{label}</label>}
      <select {...rest} className={`form-select ${error ? "is-invalid" : ""}`}>
        {children}
        {options.map((op) => (
          <option key={String(op.value)} value={op.value}>
            {op.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
