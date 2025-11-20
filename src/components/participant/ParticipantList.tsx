import ParticipantItem from "./ParticipantItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Participant, ParticipantListMode } from "./type";
import { cn } from "@/lib/utils";

type Hight = "sm" | "md" | "lg" | "auto";

interface ParticipantListProps {
    mode: ParticipantListMode;
    participants: Participant[];
    hight: Hight;
    className?: string;
}

const hightClasses: Record<Hight, string> = {
    sm: "h-20",
    md: "h-24",
    lg: "h-48",
    auto: "h-auto",
};

const ParticipantList = ({
    mode,
    participants,
    hight = "md",
    className,
}: ParticipantListProps) => {
    return (
        <ScrollArea className={cn(className, hightClasses[hight], "w-[420px]")}>
            <ul className="grid grid-cols-3 gap-1 mr-4">
                {participants.map((user) => (
                    <ParticipantItem
                        key={user.userId}
                        participant={user}
                        mode={mode}
                    />
                ))}
            </ul>
        </ScrollArea>
    );
};

export default ParticipantList;
