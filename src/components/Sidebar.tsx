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
  Users,
  Settings,
} from "lucide-react";
import ProjectTeamModal from "@/components/modal/ProjectTeamModal";
import { ProjectTeamModalTab } from "@/components/modal/type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Project, getProjectsRequest } from "@/lib/project/projectApi";
import { useProjectSidebar } from "@/lib/project/useProjectSidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { useProjectStore } from "@/store/useProjectStore";
import { useRouter, usePathname } from "next/navigation";
import {
  InviteTabContent,
  ProjectSettingsTabContent,
  OnlineMembersList,
  MemberViewTabContent,
} from "@/components/sidebar-components";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const {
    projects,
    currentProject,
    isLoading,
    setProjects,
    setCurrentProject,
    setIsLoading,
  } = useProjectStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);

  // 현재 경로에 따라 activeMenu 결정
  const getActiveMenu = () => {
    if (pathname.startsWith("/backlog")) return "Backlog";
    if (pathname.startsWith("/board")) return "Board";
    if (pathname.startsWith("/inbox")) return "Inbox";
    return "Board";
  };
  const activeMenu = getActiveMenu();

  // 사이드바 정보 조회 (useQuery)
  const { onlineUsers, isLoading: isSidebarLoading } = useProjectSidebar({
    projectId: currentProject?.projectId ?? null,
    enabled: isAuthenticated && !!currentProject?.projectId,
  });

  const menuItems = [
    {
      name: "Backlog",
      icon: Clipboard,
      hasNotification: false,
      path: "/backlog",
    },
    {
      name: "Board",
      icon: LayoutDashboard,
      hasNotification: false,
      path: "/board",
    },
    {
      name: "Inbox",
      icon: MessageSquare,
      hasNotification: true,
      path: "/inbox",
    },
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

  // 팀관리 모달 탭 구성 - 역할에 따라 다른 탭 표시
  const isLeader = currentProject?.myRole === "LEADER";

  // 리더용 탭 (초대, 프로젝트 설정)
  const leaderTabs: ProjectTeamModalTab[] = [
    {
      id: "invite",
      label: "Invite",
      title: "프로젝트 참여자 추가",
      icon: <Users className="w-4 h-4" />,
      content: (
        <InviteTabContent
          projectId={currentProject?.projectId ?? null}
          onInviteSuccess={() => setIsTeamModalOpen(false)}
        />
      ),
    },
    {
      id: "settings",
      label: "Project Setting",
      title: "프로젝트 설정",
      icon: <Settings className="w-4 h-4" />,
      content: (
        <ProjectSettingsTabContent
          projectId={currentProject?.projectId ?? null}
          projectName={currentProject?.projectName || ""}
          onDeleteSuccess={() => {
            setIsTeamModalOpen(false);
            setCurrentProject(null);
            fetchProjects();
          }}
        />
      ),
    },
  ];

  // 멤버용 탭 (읽기 전용 프로젝트 정보)
  const memberTabs: ProjectTeamModalTab[] = [
    {
      id: "project",
      label: "Project",
      title: "프로젝트 정보",
      icon: <FolderKanban className="w-4 h-4" />,
      content: (
        <MemberViewTabContent
          projectId={currentProject?.projectId ?? null}
          projectName={currentProject?.projectName || ""}
        />
      ),
    },
  ];

  const teamModalTabs = isLeader ? leaderTabs : memberTabs;

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
                onClick={() => router.push(item.path)}
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
        <OnlineMembersList members={onlineUsers} isLoading={isSidebarLoading} />
      </nav>

      {/* 팀관리 버튼 */}
      <div className="p-4">
        <button
          onClick={() => setIsTeamModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-main text-white rounded-lg transition-colors font-medium text-sm hover:opacity-90"
        >
          <span>+</span>
          <span> 팀관리</span>
        </button>
      </div>

      {/* 팀관리 모달 */}
      <ProjectTeamModal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        title={isLeader ? "프로젝트 참여자 추가" : "프로젝트 정보"}
        tabs={teamModalTabs}
        defaultTabId={isLeader ? "invite" : "project"}
      />
    </aside>
  );
}
