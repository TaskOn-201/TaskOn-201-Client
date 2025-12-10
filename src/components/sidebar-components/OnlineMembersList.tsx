"use client";

interface TeamMember {
  id: string;
  name: string;
  isOnline: boolean;
}

interface OnlineMembersListProps {
  members: TeamMember[];
}

export default function OnlineMembersList({ members }: OnlineMembersListProps) {
  return (
    <div className="px-3 py-4">
      <h3 className="px-3 text-xs font-bold text-gray5 mb-2">접속 목록</h3>
      <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
        {members.map((member) => (
          <button
            key={member.id}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray1 transition-colors relative"
          >
            <div className="relative">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  member.isOnline
                    ? "bg-gray3 text-gray4"
                    : "bg-gray2 text-gray3"
                }`}
              >
                {member.id[member.id.length - 1]}
              </div>
              {member.isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-main rounded-full border-2 border-gray1"></span>
              )}
            </div>
            <span
              className={`text-sm ${
                member.isOnline ? "text-gray4" : "text-gray3"
              }`}
            >
              {member.id}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

