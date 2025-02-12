import type { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "square" | "full" | "default",
}

export default function Button({ size = "default", children, ...props }: ButtonProps) {

  return (
    <button {...props}>{children}</button>
  );
}
