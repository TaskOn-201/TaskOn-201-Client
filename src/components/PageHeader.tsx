import { cn } from "@/lib/utils";
import React from "react";

interface PageHeaderProps {
    left: string;
    center?: React.ReactNode;
    right?: React.ReactNode;
    className?: string;
}

const PageHeader = ({ left, center, right, className }: PageHeaderProps) => {
    return (
        <header
            className={cn(
                "px-8 py-4 flex justify-between items-center bg-white",
                className
            )}
        >
            <div>
                <h2 className="text-2xl font-bold">{left}</h2>
            </div>
            <div className="flex-1 flex justify-center">{center}</div>
            <div>{right}</div>
        </header>
    );
};

export default PageHeader;
