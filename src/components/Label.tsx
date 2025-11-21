import { cn } from "../lib/utils";

type variant = "default" | "red" | "blue" | "green" | "black" | "white";
type size = "xs" | "sm" | "md";

interface LabelProps {
    label: string;
    variant?: variant;
    size?: size;
    className?: string;
    leftIcon?: React.ReactNode;
    onClick?: () => void;
}

const sizeClasses: Record<size, string> = {
    xs: "px-1.5 py-1 text-[10px]",
    sm: "px-2 py-1.5 text-xs",
    md: "px-3 py-2 text-sm",
};

const variantClasses: Record<variant, string> = {
    default: "bg-gray1 text-black",
    red: "bg-sub2/20 text-red-400",
    blue: "bg-sub3/30 text-blue-500",
    green: "bg-sub4/40 text-green-600",
    black: "bg-gray5 text-white",
    white: "bg-white border text-black",
};

const Label = ({
    label,
    variant = "default",
    size = "sm",
    className,
    leftIcon,
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
            {leftIcon ? (
                <span className="flex items-center gap-2">
                    {leftIcon}
                    {label}
                </span>
            ) : (
                <span>{label}</span>
            )}
        </Component>
    );
};

export default Label;
