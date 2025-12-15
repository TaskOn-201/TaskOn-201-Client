"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import Button from "@/components/Button";
import Input from "@/components/Input";
import VerticalDropbox from "@/components/VerticalDropbox";
import BacklogSection from "./BacklogSection";
import TaskEditorModal from "@/components/task/TaskEditorModal";
import { useProjectStore } from "@/store/useProjectStore";
import { getBoardTasks, BoardTaskItem, TaskStatus } from "@/lib/task/taskApi";
import { BacklogTaskData, BacklogLabel } from "./BacklogTaskRow";
import { LabelVariant } from "@/components/Label";

const filterOptions = [
  { label: "전체", value: "all" },
  { label: "제목", value: "title" },
  { label: "중요도", value: "priority" },
  { label: "담당자", value: "assignee" },
];

// Priority를 라벨로 변환
const getPriorityLabel = (priority: string): BacklogLabel => {
  const variantMap: Record<string, LabelVariant> = {
    HIGH: "red",
    MEDIUM: "yellow",
    LOW: "default",
  };

  return {
    name: priority,
    variant: variantMap[priority] || "default",
  };
};

// BoardTaskItem을 BacklogTaskData로 변환
const toBacklogTask = (task: BoardTaskItem): BacklogTaskData => ({
  taskId: task.taskId,
  title: task.title,
  assigneeProfileImageUrl: task.assigneeProfileImageUrl,
  participantProfileImageUrls: task.participantProfileImageUrls,
  labels: [getPriorityLabel(task.priority)],
  isUnassigned:
    !task.assigneeProfileImageUrl &&
    task.participantProfileImageUrls.length === 0,
});

export default function BacklogContent() {
  const [isTaskEditorOpen, setIsTaskEditorOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("TODO");
  const [searchValue, setSearchValue] = useState("");
  const [filterType, setFilterType] = useState("all");

  const { currentProject } = useProjectStore();

  // Task 보드 조회
  const {
    data: tasksResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["boardTasks", currentProject?.projectId],
    queryFn: () => getBoardTasks(currentProject!.projectId),
    enabled: !!currentProject?.projectId,
  });

  // 데이터 변환
  const backlogData = useMemo(() => {
    const todoTasks = tasksResponse?.data?.todo?.map(toBacklogTask) ?? [];
    const inProgressTasks =
      tasksResponse?.data?.inProgress?.map(toBacklogTask) ?? [];
    const completedTasks =
      tasksResponse?.data?.completed?.map(toBacklogTask) ?? [];

    // 검색 필터 적용
    const filterTasks = (tasks: BacklogTaskData[]) => {
      if (!searchValue) return tasks;
      const lowerSearch = searchValue.toLowerCase();

      return tasks.filter((task) => {
        switch (filterType) {
          case "title":
            return task.title.toLowerCase().includes(lowerSearch);
          case "priority":
            return task.labels.some((label) =>
              label.name.toLowerCase().includes(lowerSearch)
            );
          case "assignee":
            // 담당자가 있으면 true (검색어가 있을 때 담당자 있는 태스크만)
            // "unassigned" 검색 시 미배정 태스크 반환
            if (lowerSearch === "unassigned" || lowerSearch === "미배정") {
              return task.isUnassigned;
            }
            return !task.isUnassigned;
          case "all":
          default:
            // 전체: 제목 또는 중요도에서 검색
            return (
              task.title.toLowerCase().includes(lowerSearch) ||
              task.labels.some((label) =>
                label.name.toLowerCase().includes(lowerSearch)
              )
            );
        }
      });
    };

    return {
      todo: filterTasks(todoTasks),
      inProgress: filterTasks(inProgressTasks),
      completed: filterTasks(completedTasks),
    };
  }, [tasksResponse, searchValue, filterType]);

  // 각 섹션별 태스크 생성 핸들러
  const handleAddTask = (status: TaskStatus) => {
    setDefaultStatus(status);
    setIsTaskEditorOpen(true);
  };

  // 검색 핸들러
  const handleSearch = (value: string) => {
    setSearchValue(value);
  };

  return (
    <>
      <main className="overflow-y-auto bg-white">
        {/* 헤더 */}
        <header className="px-8 py-4 flex items-center justify-between">
          {/* 왼쪽: 제목 */}
          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-bold text-gray5">Backlog</h1>
            <button className="p-1 text-gray4 hover:text-gray5 transition-colors">
              <ChevronDown size={20} />
            </button>
          </div>

          {/* 중앙: 필터 & 검색 */}
          <div className="flex items-center gap-3">
            <VerticalDropbox
              options={filterOptions}
              checkValue={filterType}
              onChange={setFilterType}
              placeholder="Button"
              className="w-28 py-4.5"
            />
            <Input
              search
              placeholder="Search"
              className="w-64"
              onSearch={handleSearch}
              onClear={() => setSearchValue("")}
            />
          </div>

          {/* 오른쪽: Add task 버튼 */}
          <Button
            label="+ Add task"
            size="sm"
            className="font-semibold px-4 py-2"
            onClick={() => handleAddTask("TODO")}
          />
        </header>

        {/* 컨텐츠 */}
        <div className="px-8 py-4">
          {!currentProject ? (
            <div className="text-center py-20 text-gray3">
              프로젝트를 선택해주세요.
            </div>
          ) : isLoading ? (
            <div className="text-center py-20 text-gray3">로딩 중...</div>
          ) : isError ? (
            <div className="text-center py-20 text-sub2">
              데이터를 불러오는데 실패했습니다.
              <button
                onClick={() => refetch()}
                className="ml-2 underline hover:text-red-700"
              >
                다시 시도
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              {/* To Do 섹션 */}
              <BacklogSection
                title="To Do"
                tasks={backlogData.todo}
                defaultExpanded={false}
                onAddTask={() => handleAddTask("TODO")}
                onUpdate={() => refetch()}
              />

              {/* In Progress 섹션 */}
              <BacklogSection
                title="In Progress"
                tasks={backlogData.inProgress}
                defaultExpanded={true}
                onAddTask={() => handleAddTask("IN_PROGRESS")}
                onUpdate={() => refetch()}
              />

              {/* Completed 섹션 */}
              <BacklogSection
                title="Completed"
                tasks={backlogData.completed}
                defaultExpanded={true}
                onAddTask={() => handleAddTask("COMPLETED")}
                onUpdate={() => refetch()}
              />
            </div>
          )}
        </div>
      </main>

      {/* Task 생성 모달 */}
      {currentProject && (
        <TaskEditorModal
          isOpen={isTaskEditorOpen}
          onClose={() => setIsTaskEditorOpen(false)}
          projectId={currentProject.projectId}
          defaultStatus={defaultStatus}
          onSuccess={() => {
            refetch();
          }}
        />
      )}
    </>
  );
}
