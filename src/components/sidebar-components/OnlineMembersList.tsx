"use client";

import { OnlineUser } from "@/lib/project/projectApi";

interface OnlineMembersListProps {
  members: OnlineUser[];
  isLoading?: boolean;
}

export default function OnlineMembersList({
  members,
  isLoading = false,
}: OnlineMembersListProps) {
  // 온라인 유저를 먼저, 오프라인 유저를 나중에 정렬
  const sortedMembers = [...members].sort((a, b) => {
    if (a.online === b.online) return 0;
    return a.online ? -1 : 1;
  });

  return (
    <div className="px-3 py-4">
      <h3 className="px-3 text-xs font-bold text-gray5 mb-2">접속 목록</h3>
      <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
        {isLoading ? (
          <div className="px-3 py-2 text-sm text-gray3">로딩 중...</div>
        ) : sortedMembers.length === 0 ? (
          <div className="px-3 py-2 text-sm text-gray3">멤버가 없습니다</div>
        ) : (
          sortedMembers.map((member) => (
            <button
              key={member.userId}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray1 transition-colors relative"
            >
              <div className="relative">
                {member.profileImageUrl ? (
                  <img
                    src={member.profileImageUrl}
                    alt={member.name}
                    className={`w-6 h-6 rounded-full object-cover ${
                      !member.online && "opacity-50"
                    }`}
                  />
                ) : (
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      member.online
                        ? "bg-gray3 text-gray4"
                        : "bg-gray2 text-gray3"
                    }`}
                  >
                    {member.name.charAt(0)}
                  </div>
                )}
                {member.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-main rounded-full border-2 border-gray1"></span>
                )}
              </div>
              <span
                className={`text-sm ${
                  member.online ? "text-gray4" : "text-gray3"
                }`}
              >
                {member.name}
              </span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
