import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Label from "../Label";
import { PopoverDropboxOption } from "./type";
interface PopoverDropboxProps {
    options: PopoverDropboxOption[];
    className?: string;
    height?: "default" | "fit";
}

const heightClasses = {
    default: "h-8",
    fit: "h-fit",
};

const PopoverDropbox = ({
    options,
    className,
    height = "default",
}: PopoverDropboxProps) => {
    return (
        <ScrollArea className={heightClasses[height]}>
            <div
                className={cn(
                    className,
                    "flex flex-wrap gap-3 items-center translate-y-0.5"
                )}
            >
                {options.map((option) => (
                    <Label
                        key={option.value}
                        text={option.label}
                        variant={option.variant}
                        leftIcon={option.leftIcon}
                        onClick={option.onClick}
                    />
                ))}
            </div>
        </ScrollArea>
    );
};

export default PopoverDropbox;
