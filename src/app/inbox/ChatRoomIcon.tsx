import Profile from "@/components/Profile";
import { CheckSquare, Cloud } from "lucide-react";
import { ChatRoomData } from "./type";

interface ChatRoomIconProps {
    room: ChatRoomData;
    myUserId: number | undefined;
}

const ChatRoomIcon = ({ room, myUserId }: ChatRoomIconProps) => {
    if (room.chatType === "PERSONAL") {
        const opponent = room.participants.find(
            (user) => user.userId !== myUserId
        );

        return (
            <Profile
                size="sm"
                userName={opponent?.name.charAt(0) ?? ""}
                imageUrl={opponent?.profileImageUrl}
                className="text-sm"
            />
        );
    }

    if (room.chatType === "PROJECT_GROUP") {
        return (
            <div className="w-10 h-10 rounded-full bg-main/10 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-main" />
            </div>
        );
    }

    if (room.chatType === "TASK_GROUP") {
        return (
            <div className="w-10 h-10 rounded-full bg-sub2/10 flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-sub2" />
            </div>
        );
    }

    return null;
};

export default ChatRoomIcon;
