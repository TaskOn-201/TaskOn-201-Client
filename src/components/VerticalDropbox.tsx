import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface DropdownOption {
    label: string;
    value: string;
}

interface verticalDropboxProps {
    checkValue?: string;
    options: DropdownOption[];
    size?: "sm" | "md" | "lg" | "full";
    placeholder?: string;
    onChange?: (value: string) => void;
    className?: string;
}

const sizeClasses: Record<NonNullable<verticalDropboxProps["size"]>, string> = {
    sm: "w-22",
    md: "w-30",
    lg: "w-40",
    full: "w-full",
};

const VerticalDropbox = ({
    checkValue,
    options,
    size = "sm",
    placeholder = "선택",
    className,
    onChange,
}: verticalDropboxProps) => {
    return (
        <Select value={checkValue} onValueChange={onChange}>
            <SelectTrigger
                size="sm"
                className={cn(sizeClasses[size], className)}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="min-w-20">
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default VerticalDropbox;
