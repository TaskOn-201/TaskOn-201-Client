"use client"

import { cn } from "../lib/utils";

export type LabelVariant =
    | "default"
    | "red"
    | "blue"
    | "green"
    | "black"
    | "white"
    | "yellow";
type size = "xs" | "sm" | "md";

interface LabelProps {
    text: string;
    variant?: LabelVariant;
    size?: size;
    className?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    onClick?: () => void;
}

const sizeClasses: Record<size, string> = {
    xs: "px-1.5 py-1 text-[10px]",
    sm: "px-2 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
};

const variantClasses: Record<LabelVariant, string> = {
    default: "bg-gray1 text-black/60",
    red: "bg-sub2/20 text-red-400",
    blue: "bg-sub3/30 text-blue-500",
    green: "bg-sub4/40 text-green-600",
    black: "bg-gray5 text-white",
    white: "bg-white border text-black",
    yellow: "bg-yellow-200/70  text-yellow-600",
};

const Label = ({
    text,
    variant = "default",
    size = "sm",
    className,
    leftIcon,
    rightIcon,
    onClick,
}: LabelProps) => {
    const Component = onClick ? "button" : "div";

    return (
        <Component
            className={cn(
                "rounded-full inline-flex items-center",
                sizeClasses[size],
                variantClasses[variant],
                onClick && "cursor-pointer",
                className
            )}
            type={onClick ? "button" : undefined}
            onClick={onClick}
        >
            <span className="flex items-center gap-2">
                {leftIcon && leftIcon}
                {text}
            </span>
            {rightIcon && (
                <span className="flex items-center">{rightIcon}</span>
            )}
        </Component>
    );
};

export default Label;
