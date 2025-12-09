"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  SearchedMember,
  ProjectMember,
  searchProjectMembersRequest,
  inviteProjectMembersRequest,
  getProjectMembersRequest,
} from "@/lib/project/projectApi";
import { toast } from "sonner";

interface InviteTabContentProps {
  projectId: number | null;
  onInviteSuccess: () => void;
}

export default function InviteTabContent({
  projectId,
  onInviteSuccess,
}: InviteTabContentProps) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState<SearchedMember[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<SearchedMember[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // 기존 프로젝트 멤버 목록
  const [projectMembers, setProjectMembers] = useState<ProjectMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);

  // 프로젝트 멤버 조회
  const fetchProjectMembers = useCallback(async () => {
    if (!projectId) return;

    setIsLoadingMembers(true);
    try {
      const response = await getProjectMembersRequest(projectId);
      setProjectMembers(response.data);
    } catch (error) {
      console.error("멤버 조회 실패:", error);
    } finally {
      setIsLoadingMembers(false);
    }
  }, [projectId]);

  // 프로젝트 ID가 변경되면 멤버 목록 조회
  useEffect(() => {
    fetchProjectMembers();
  }, [fetchProjectMembers]);

  // 멤버 검색
  const handleSearchMembers = useCallback(
    async (keyword: string) => {
      if (!projectId || keyword.trim().length === 0) {
        setSearchResults([]);
        setShowSearchDropdown(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await searchProjectMembersRequest({
          projectId,
          keyword: keyword.trim(),
          page: 0,
          size: 10,
        });
        // 이미 프로젝트에 있는 멤버는 검색 결과에서 제외
        const filteredResults = response.data.content.filter(
          (member) => !projectMembers.some((pm) => pm.userId === member.userId)
        );
        setSearchResults(filteredResults);
        setShowSearchDropdown(filteredResults.length > 0);
      } catch (error) {
        console.error("멤버 검색 실패:", error);
        setSearchResults([]);
        setShowSearchDropdown(false);
      } finally {
        setIsSearching(false);
      }
    },
    [projectId, projectMembers]
  );

  // 검색어 변경 핸들러
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKeyword(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      handleSearchMembers(value);
    }, 300);
  };

  // 멤버 선택/해제 토글
  const toggleMemberSelection = (member: SearchedMember) => {
    setSelectedMembers((prev) => {
      const isSelected = prev.some((m) => m.userId === member.userId);
      if (isSelected) {
        return prev.filter((m) => m.userId !== member.userId);
      } else {
        return [...prev, member];
      }
    });
  };

  // 멤버가 선택되어 있는지 확인
  const isMemberSelected = (userId: number) => {
    return selectedMembers.some((m) => m.userId === userId);
  };

  // 멤버 초대 핸들러
  const handleInviteMembers = async () => {
    if (!projectId || selectedMembers.length === 0) return;

    try {
      const userIds = selectedMembers.map((m) => m.userId);
      await inviteProjectMembersRequest(projectId, userIds);

      // 성공 시 상태 초기화 및 멤버 목록 새로고침
      setSelectedMembers([]);
      setSearchKeyword("");
      setSearchResults([]);
      setShowSearchDropdown(false);

      toast.success("멤버가 성공적으로 추가되었습니다.");
      fetchProjectMembers(); // 멤버 목록 새로고침
      onInviteSuccess();
    } catch (error) {
      console.error("멤버 초대 실패:", error);
      toast.error("멤버 초대에 실패했습니다.");
    }
  };

  // 검색 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto flex flex-col gap-6">
        {/* 검색 입력 필드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            새 멤버 추가
          </label>
          <div ref={searchContainerRef} className="relative ml-0.5 mr-0.5">
            <input
              type="text"
              value={searchKeyword}
              onChange={handleSearchInputChange}
              onFocus={() => {
                if (searchResults.length > 0) {
                  setShowSearchDropdown(true);
                }
              }}
              placeholder="이름 또는 이메일로 사용자 검색"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-main text-sm"
            />
            {/* 로딩 스피너너*/}
            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-main border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* 검색 결과 드롭다운 */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((member) => (
                  <button
                    key={member.userId}
                    type="button"
                    onClick={() => toggleMemberSelection(member)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${
                      isMemberSelected(member.userId) ? "bg-blue-50" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isMemberSelected(member.userId)}
                      onChange={() => {}}
                      className="w-4 h-4 rounded border-gray-300 text-main focus:ring-main"
                    />
                    {member.profileImageUrl ? (
                      <img
                        src={member.profileImageUrl}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {member.name[0]}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {member.email}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* 검색 결과 없음 */}
            {showSearchDropdown &&
              searchKeyword.trim() &&
              searchResults.length === 0 &&
              !isSearching && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-sm text-gray-500">
                  검색 결과가 없습니다
                </div>
              )}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* 현재 프로젝트 멤버 목록 */}
        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            현재 참여자 ({projectMembers.length}명)
          </label>
          {isLoadingMembers ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
              로딩 중...
            </div>
          ) : projectMembers.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-sm text-gray-500">
              참여자가 없습니다
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
              {projectMembers.map((member) => (
                <div
                  key={member.userId}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg group"
                >
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
                  <div className="flex-1 flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-700 truncate block text-center">
                      {member.name}
                    </span>
                    {member.role === "LEADER" && (
                      <span className="text-xs text-main font-medium">
                        리더
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 선택된 사용자 목록 */}
        {selectedMembers.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              선택된 사용자 ({selectedMembers.length}명)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {selectedMembers.map((member) => (
                <label
                  key={member.userId}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => toggleMemberSelection(member)}
                    className="w-4 h-4 rounded border-gray-300 text-main focus:ring-main"
                  />
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
                  <span className="text-sm text-gray-700 truncate">
                    {member.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 추가 버튼  */}
      <div className="shrink-0 pt-4 bg-white border-t border-gray-100">
        <div className="flex justify-end">
          <button
            onClick={handleInviteMembers}
            disabled={selectedMembers.length === 0}
            className={`px-6 py-2 rounded-lg transition-colors text-sm font-medium ${
              selectedMembers.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-main text-white hover:opacity-90"
            }`}
          >
            추가 {selectedMembers.length > 0 && `(${selectedMembers.length}명)`}
          </button>
        </div>
      </div>
    </div>
  );
}
