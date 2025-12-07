import React from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "link";
type Size = "sm" | "md" | "lg";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  className?: string;
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) {
  const base = "btn";
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  const variantClass =
    variant === "primary"
      ? "btn-primary"
      : variant === "secondary"
      ? "btn-secondary"
      : variant === "danger"
      ? "btn-danger"
      : "btn-link";

  return (
    <button className={clsx(base, variantClass, sizeClass, className)} {...rest}>
      {children}
    </button>
  );
}
