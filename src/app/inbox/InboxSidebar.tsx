import { Search, Pencil } from "lucide-react";
import Button from "@/components/Button";
import { ChatRoomData } from "./type";
import MessageListItem from "./MessageListItem";
import { useState } from "react";

interface InboxSidebarProps {
    rooms: ChatRoomData[];
    selectedRoomId: number | null;
    onRoomClick: (room: ChatRoomData) => void;
    myUserId: number | undefined;
}

const InboxSidebar = ({
    rooms,
    selectedRoomId,
    onRoomClick,
    myUserId,
}: InboxSidebarProps) => {
    const [keywordInput, setKeywordInput] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    const trimmed = searchKeyword.trim();
    const keywordLower = trimmed.toLowerCase();

    const filteredRooms =
        trimmed.length === 0
            ? rooms
            : rooms.filter((room) => {
                  const matchUserName = room.participants.some((participant) =>
                      participant.name.toLowerCase().includes(keywordLower)
                  );
                  const matchRoomName = room.roomName
                      .toLowerCase()
                      .includes(keywordLower);

                  return matchUserName || matchRoomName;
              });

    const handleSearch = () => {
        setSearchKeyword(keywordInput);
    };

    return (
        <div
            className="
              border-r border-gray-200
              flex flex-col
              basis-96
              min-w-60
              max-w-[380px]
              shrink
            "
        >
            {/* 검색 바 */}
            <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray3 w-4 h-4" />
                    <input
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="참여한 사용자 이름 혹은 Task 이름 검색"
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                    />
                </div>
                <Button
                    variant="white"
                    size="sm"
                    icon={<Pencil className="w-5 h-5" />}
                    className="text-gray3 hover:text-main border border-gray-200"
                    onClick={handleSearch}
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                {filteredRooms.length === 0 ? (
                    <div className="p-4 text-sm text-gray-400">
                        검색 결과 혹은 채팅방이 없습니다.
                    </div>
                ) : (
                    filteredRooms.map((room) => (
                        <MessageListItem
                            key={room.chatRoomId}
                            room={room}
                            isSelected={selectedRoomId === room.chatRoomId}
                            onClick={() => onRoomClick(room)}
                            myUserId={myUserId}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default InboxSidebar;
