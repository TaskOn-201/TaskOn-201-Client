"use client";

import { useState, useEffect } from "react";
import {
  Clipboard,
  LayoutDashboard,
  MessageSquare,
  ChevronDown,
  Plus,
  FolderKanban,
  Play,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Project,
  deleteProjectRequest,
  getProjectsRequest,
} from "@/lib/project/projectApi";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState("Board");
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const menuItems = [
    { name: "Backlog", icon: Clipboard, hasNotification: false },
    { name: "Board", icon: LayoutDashboard, hasNotification: false },
    { name: "Inbox", icon: MessageSquare, hasNotification: true },
  ];

  const teamMembers = [
    { id: "user01", name: "사용자1", isOnline: true },
    { id: "user02", name: "사용자2", isOnline: false },
    { id: "user03", name: "사용자3", isOnline: true },
    { id: "user04", name: "사용자4", isOnline: true },
    { id: "user05", name: "사용자5", isOnline: false },
    { id: "user06", name: "사용자6", isOnline: true },
    { id: "user07", name: "사용자7", isOnline: true },
    { id: "user08", name: "사용자8", isOnline: false },
    { id: "user09", name: "사용자9", isOnline: true },
  ];

  // 프로젝트 목록 조회
  const fetchProjects = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const response = await getProjectsRequest();
      setProjects(response.data);
      if (response.data.length > 0 && !currentProject) {
        setCurrentProject(response.data[0]);
      }
    } catch (error) {
      console.error("프로젝트 목록 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 프로젝트 선택
  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
    setDropdownOpen(false);
  };

  // 인증 상태가 변경되면 프로젝트 목록 조회
  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);
  const handleDeleteProject = async (
    projectId: number,
    projectName: string
  ) => {
    try {
      await deleteProjectRequest(projectId, projectName);

      // 삭제된 프로젝트가 현재 선택된 프로젝트인 경우 처리
      if (currentProject?.projectId === projectId) {
        const remainingProjects = projects.filter(
          (p) => p.projectId !== projectId
        );
        setCurrentProject(
          remainingProjects.length > 0 ? remainingProjects[0] : null
        );
      }

      fetchProjects();
    } catch (error) {
      console.error("프로젝트 삭제 실패:", error);
    }
  };
  return (
    <aside className="w-80 h-screen bg-white flex flex-col border-r border-gray1">
      {/* 헤더 - 프로젝트 선택 드롭다운 */}
      <div className="p-6">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-gray1 rounded-lg p-2 -m-2 transition-colors w-full">
              <div className="w-8 h-8 bg-main rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-md font-bold text-main2 truncate">
                  {currentProject?.projectName || "프로젝트 선택"}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            {/* 프로젝트 목록 */}
            <div className="max-h-48 overflow-y-auto">
              {isLoading ? (
                <div className="px-2 py-3 text-sm text-gray4 text-center">
                  로딩 중...
                </div>
              ) : projects.length === 0 ? (
                <div className="px-2 py-3 text-sm text-gray4 text-center">
                  프로젝트가 없습니다
                </div>
              ) : (
                projects.map((project) => (
                  <DropdownMenuItem
                    key={project.projectId}
                    onClick={() => handleSelectProject(project)}
                    className={`cursor-pointer ${
                      currentProject?.projectId === project.projectId
                        ? "bg-gray1"
                        : ""
                    }`}
                  >
                    <FolderKanban className="w-4 h-4 mr-2 text-main" />
                    <span className="truncate">{project.projectName}</span>
                    <button
                      type="button"
                      className="ml-auto p-1 rounded hover:bg-red-100"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteProject(
                          project.projectId,
                          project.projectName
                        );
                      }}
                    >
                      <Trash className="w-4 h-4 text-red-500 hover:text-red-700" />
                    </button>
                  </DropdownMenuItem>
                ))
              )}
            </div>

            <DropdownMenuSeparator />

            {/* 프로젝트 생성 버튼 */}
            <DropdownMenuItem
              onClick={() => {
                setDropdownOpen(false);
                router.push("/projects");
              }}
              className="cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-2 text-main" />
              <span>새 프로젝트 생성</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 메뉴 항목 */}
      <nav className="flex-1 overflow-y-auto flex flex-col justify-between">
        <div className="px-2 py-6 space-y-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => setActiveMenu(item.name)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors relative hover:bg-gray1 ${
                  activeMenu === item.name
                    ? "text-main font-bold"
                    : "text-gray4"
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span className="text-sm font-medium">{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* 접속 목록 */}
        <div className="px-3 py-4">
          <h3 className="px-3 text-xs font-bold text-gray5 mb-2">접속 목록</h3>
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {teamMembers.map((member) => (
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
                    {member.id[9]}
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
      </nav>

      {/* 팀관리 버튼 */}
      <div className="p-4">
        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-lg transition-colors font-medium text-sm hover:opacity-90">
          <span>+</span>
          <span> 팀관리</span>
        </button>
      </div>
    </aside>
  );
}
