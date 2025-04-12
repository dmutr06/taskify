import type { ButtonHTMLAttributes } from "react";

import styles from "./Button.module.scss";

type Size = "default" | "small" | "large" | "full" | "square";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    size?: Size,
}

export default function Button({ children, size = "default", className, ...props }: ButtonProps) {
    return (
        <button 
            className={`${styles.btn} ${styles[size]} ${className || ""}`}
            {...props}
        >
            {children}
        </button>
    );
}
