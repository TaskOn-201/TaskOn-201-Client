"use client";

import { useState, useEffect, useCallback } from "react";
import { Minus } from "lucide-react";
import {
  ProjectMember,
  getProjectMembersRequest,
  deleteProjectRequest,
  removeProjectMemberRequest,
} from "@/lib/project/projectApi";
import { toast } from "sonner";

interface ProjectSettingsTabContentProps {
  projectId: number | null;
  projectName: string;
  onDeleteSuccess?: () => void;
}

export default function ProjectSettingsTabContent({
  projectId,
  projectName,
  onDeleteSuccess,
}: ProjectSettingsTabContentProps) {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [deleteConfirmName, setDeleteConfirmName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // 리더 찾기
  const leader = members.find((m) => m.role === "LEADER");
  // 일반 멤버들
  const regularMembers = members.filter((m) => m.role === "MEMBER");

  // 프로젝트 멤버 조회
  const fetchMembers = useCallback(async () => {
    if (!projectId) return;

    setIsLoadingMembers(true);
    try {
      const response = await getProjectMembersRequest(projectId);
      setMembers(response.data);
    } catch (error) {
      console.error("멤버 조회 실패:", error);
      toast.error("멤버 조회에 실패했습니다.");
    } finally {
      setIsLoadingMembers(false);
    }
  }, [projectId]);

  // projectId 변경 시 멤버 조회
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // 멤버 삭제
  const handleRemoveMember = async (userId: number, memberName: string) => {
    if (!projectId) return;

    try {
      await removeProjectMemberRequest(projectId, userId);
      toast.success(`${memberName}님이 프로젝트에서 제외되었습니다.`);
      fetchMembers();
    } catch (error) {
      console.error("멤버 삭제 실패:", error);
      toast.error("멤버 삭제에 실패했습니다.");
    }
  };

  // 프로젝트 삭제
  const handleDeleteProject = async () => {
    if (!projectId || !projectName) return;

    if (deleteConfirmName !== projectName) {
      toast.error("프로젝트 이름이 일치하지 않습니다.");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteProjectRequest(projectId, projectName);
      toast.success("프로젝트가 삭제되었습니다.");
      setDeleteConfirmName("");
      onDeleteSuccess?.();
    } catch (error) {
      console.error("프로젝트 삭제 실패:", error);
      toast.error("프로젝트 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
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
        {isLoadingMembers ? (
          <div className="text-sm text-gray-500">로딩 중...</div>
        ) : leader ? (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {leader.profileImageUrl ? (
              <img
                src={leader.profileImageUrl}
                alt={leader.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                {leader.name[0]}
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">
                {leader.name}
              </div>
              <div className="text-xs text-gray-500">{leader.email}</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">리더 정보가 없습니다.</div>
        )}
      </div>
      {/* 참여자 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          참여자 ({regularMembers.length}명)
        </label>
        {isLoadingMembers ? (
          <div className="text-sm text-gray-500">로딩 중...</div>
        ) : regularMembers.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-4">
            참여자가 없습니다
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
            {regularMembers.map((member) => (
              <div
                key={member.userId}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group"
              >
                {/* 프로필 이미지 + 삭제 버튼 배지 */}
                <div className="relative">
                  {member.profileImageUrl ? (
                    <img
                      src={member.profileImageUrl}
                      alt={member.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">
                      {member.name[0]}
                    </div>
                  )}
                  {/* 삭제 버튼 */}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveMember(member.userId, member.name)
                    }
                    className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-gray3 flex items-center justify-center shadow-sm hover:bg-red-400 transition-colors"
                    title="멤버 제외"
                  >
                    <Minus className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                  </button>
                </div>
                <span className="flex-1 text-sm text-gray-700 text-center truncate">
                  {member.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="border-gray-200" />

      {/* 프로젝트 삭제 */}
      <div>
        <label className="block text-sm font-medium text-red-600 mb-2">
          프로젝트 삭제
        </label>
        <p className="text-xs text-gray-500 mb-3">
          프로젝트를 삭제하려면 아래에 프로젝트 이름 &quot;{projectName}&quot;을
          정확히 입력하세요.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={deleteConfirmName}
            onChange={(e) => setDeleteConfirmName(e.target.value)}
            placeholder={projectName || "프로젝트 이름 입력"}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 text-sm"
          />
          <button
            onClick={handleDeleteProject}
            disabled={isDeleting || deleteConfirmName !== projectName}
            className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
              deleteConfirmName === projectName && !isDeleting
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isDeleting ? "삭제 중..." : "삭제"}
          </button>
        </div>
      </div>
    </div>
  );
}
