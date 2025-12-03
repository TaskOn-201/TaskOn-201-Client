"use client";

import {
    Popover,
    PopoverAnchor,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface PopoverActionItemProps {
    trigger: React.ReactNode;
    content: (close: () => void) => React.ReactNode;
    contentWidth?: string;
    className?: string;
}

const PopoverActionItem = ({
    trigger,
    content,
    contentWidth = "w-fit",
    className,
}: PopoverActionItemProps) => {
    const [open, setOpen] = useState(false);

    // 선택 시 popover close
    const close = () => setOpen(false);

    const render = typeof content === "function" ? content(close) : content;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverAnchor asChild>
                <div className="inline-flex items-center gap-2 cursor-pointer">
                    <PopoverTrigger asChild>{trigger}</PopoverTrigger>
                </div>
            </PopoverAnchor>
            <PopoverContent
                align="start"
                side="bottom"
                className={cn(contentWidth, className)}
            >
                {render}
            </PopoverContent>
        </Popover>
    );
};

export default PopoverActionItem;
