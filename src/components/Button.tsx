"use client"

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "disable" | "white";
  size?: "sm" | "md";
  fullWidth?: boolean;
  isLoading?: boolean;
}

const variantStyle: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-main text-white hover:bg-[#0290a3]",
  secondary: "bg-sub1 text-main2 hover:bg-[#93ddda]",
  danger: "bg-sub2/20 text-red-500 hover:bg-sub2/30",
  disable: "bg-gray2 text-black hover:bg-gray3/30",
  white: "bg-white text-main2 hover:bg-gray1",
};

const sizeStyle: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-2 py-2 text-sm",
  md: "px-3 py-3",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      icon,
      variant = "primary",
      size = "sm",
      fullWidth = false,
      className = "",
      disabled = false,
      isLoading = false,
      type = "button",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-md cursor-pointer transition-colors focus:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-65",
          variantStyle[variant],
          sizeStyle[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            {icon && (
              <span className={`flex items-center ${label ? "mr-2" : ""}`}>
                {icon}
              </span>
            )}
            {label && <span>{label}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
