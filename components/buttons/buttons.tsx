"use client"
import { AllHTMLAttributes } from "react";
import styles from './button.module.css'
interface ButtonProsp extends AllHTMLAttributes<HTMLButtonElement>{
    variant?: "primary" | "secondary" | "tertiary";
    sizeButton?: "small" | "medium" | "large";
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    otherClassName?: string;
}


export const Button = ({ children,  variant, otherClassName, ...props}: ButtonProsp) => {
    return (
        <button className={`btn btn-${variant || "primary"} ${otherClassName}`} type="button" {...props}>{children}</button>
    )
}