import Profile from "../Profile";
import { cn } from "@/lib/utils";
import Button from "../Button";
import { Minus } from "lucide-react";
import { Participant, ParticipantListMode } from "./type";

interface ParticipantItemProps {
    mode: ParticipantListMode;
    participant: Participant;
}

const ParticipantItem = ({ mode, participant }: ParticipantItemProps) => {
    const { name, profileImageUrl, removable, isExisting, role } = participant;

    const showDeleteBtn =
        mode === "read"
            ? false
            : mode === "invite"
            ? removable
            : mode === "delete" && role !== "LEADER"
            ? true
            : false;

    return (
        <li
            className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-md cursor-pointer hover:bg-gray1/40",
                mode === "invite" && isExisting
                    ? "bg-sub1/40 hover:bg-sub1/40"
                    : "bg-white"
            )}
        >
            <div className="relative">
                {showDeleteBtn && (
                    <Button
                        variant="disable"
                        icon={<Minus className="w-2" />}
                        size="sm"
                        className="w-0.5 h-0.5 absolute -top-0.5 -right-1.5 z-10"
                    />
                )}
                <Profile size="sm" imageUrl={profileImageUrl} />
            </div>
            <span className="text-xs overflow-hidden text-ellipsis">
                {name}
            </span>
        </li>
    );
};

export default ParticipantItem;
