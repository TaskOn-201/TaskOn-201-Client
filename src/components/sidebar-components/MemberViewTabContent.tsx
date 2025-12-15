"use client";

import { useProjectMembers } from "@/lib/project/useProjectMembers";

interface MemberViewTabContentProps {
  projectId: number | null;
  projectName: string;
}

export default function MemberViewTabContent({
  projectId,
  projectName,
}: MemberViewTabContentProps) {
  const { leader, regularMembers, isLoading } = useProjectMembers({
    projectId,
  });

  return (
    <div className="space-y-6">
      {/* 프로젝트 이름 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          프로젝트 이름
        </label>
        <input
          type="text"
          value={projectName || ""}
          readOnly
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-600"
        />
      </div>

      {/* 리더 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          리더
        </label>
        {isLoading ? (
          <div className="text-sm text-gray-500">로딩 중...</div>
        ) : leader ? (
          <input
            type="text"
            value={leader.name}
            readOnly
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-600"
          />
        ) : (
          <div className="text-sm text-gray-500">리더 정보가 없습니다.</div>
        )}
      </div>

      {/* 참여자 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          참여자
        </label>
        {isLoading ? (
          <div className="text-sm text-gray-500">로딩 중...</div>
        ) : regularMembers.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-4">
            참여자가 없습니다
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {regularMembers.map((member) => (
              <div key={member.userId} className="flex items-center gap-2">
                {/* 프로필 이미지 */}
                {member.profileImageUrl ? (
                  <img
                    src={member.profileImageUrl}
                    alt={member.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs shrink-0">
                    {member.name[0]}
                  </div>
                )}
                <span className="text-sm text-gray-700 truncate">
                  {member.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
