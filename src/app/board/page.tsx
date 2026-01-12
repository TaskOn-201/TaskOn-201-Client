"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import PageHeader from "@/components/PageHeader";
import VerticalDropbox from "@/components/VerticalDropbox";
import StateSection from "./StateSection";
import { StateDataProps } from "./type";
import { useState, useMemo } from "react";
import TaskCreateModal from "@/components/task/TaskEditorModal";
import { useProjectStore } from "@/store/useProjectStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getBoardTasks,
    BoardTaskItem,
    updateTaskStatus,
    TaskStatus,
} from "@/lib/task/taskApi";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { toast } from "sonner";

const filterOptions = [
    {
        label: "전체",
        value: "all",
    },
    {
        label: "제목",
        value: "title",
    },
    {
        label: "중요도",
        value: "priority",
    },
    {
        label: "담당자",
        value: "assignee",
    },
];

type BoardData = {
    todo: StateDataProps[];
    inProgress: StateDataProps[];
    completed: StateDataProps[];
    archived: StateDataProps[];
};

// 아카이브 상태
type MovableTaskStatus = Exclude<TaskStatus, "ARCHIVED">;

const Board = () => {
    const [isTaskEditorModalOpen, setIsTaskEditorModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [activeTask, setActiveTask] = useState<StateDataProps | null>(null);
    const [includeArchived, setIncludeArchived] = useState(false);
    const { currentProject } = useProjectStore();
    const queryClient = useQueryClient();

    // Task 보드 조회
    const {
        data: tasksResponse,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["boardTasks", currentProject?.projectId, includeArchived],
        queryFn: () =>
            getBoardTasks(currentProject!.projectId, { includeArchived }),
        enabled: !!currentProject?.projectId,
    });

    // 드래그 센서 설정 (클릭과 드래그 구분)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8, // 8px 이상 이동해야 드래그 시작
            },
        })
    );

    // 태스크 ID로 현재 상태 찾기
    const getTaskStatus = (taskId: number): TaskStatus | null => {
        if (tasksResponse?.data?.todo?.find((t) => t.taskId === taskId))
            return "TODO";
        if (tasksResponse?.data?.inProgress?.find((t) => t.taskId === taskId))
            return "IN_PROGRESS";
        if (tasksResponse?.data?.completed?.find((t) => t.taskId === taskId))
            return "COMPLETED";
        return null;
    };

    // 태스크 ID로 태스크 찾기
    const findTaskById = (taskId: number): BoardTaskItem | undefined => {
        return (
            tasksResponse?.data?.todo?.find((t) => t.taskId === taskId) ||
            tasksResponse?.data?.inProgress?.find((t) => t.taskId === taskId) ||
            tasksResponse?.data?.completed?.find((t) => t.taskId === taskId)
        );
    };

    // 상태 변경 뮤테이션
    const statusMutation = useMutation({
        mutationFn: ({
            taskId,
            status,
        }: {
            taskId: number;
            status: TaskStatus;
        }) => updateTaskStatus(currentProject!.projectId, taskId, status),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["boardTasks", currentProject?.projectId],
            });
            // 드래그한 태스크의 상세 캐시도 무효화
            queryClient.invalidateQueries({
                queryKey: ["taskDetail", currentProject?.projectId, variables.taskId],
            });
            toast.success("태스크 상태가 변경되었습니다.");
        },
        onError: (error: Error) => {
            console.error("상태 변경 실패:", error);
            // 서버에서 반환한 에러 메시지 표시 (없으면 기본 메시지)
            toast.error(error.message || "상태 변경에 실패했습니다.");
            // 실패 시 데이터 리페치 (낙관적 업데이트 롤백)
            queryClient.invalidateQueries({
                queryKey: ["boardTasks", currentProject?.projectId],
            });
        },
    });

    // 드래그 시작 핸들러
    const handleDragStart = (event: DragStartEvent) => {
        if (includeArchived) {
            toast.warning("아카이브 보기 상태에서는 불가능한 동작입니다.");
            setActiveTask(null);
            return;
        }

        const { active } = event;
        const taskData = active.data.current?.task as StateDataProps;
        if (taskData) {
            setActiveTask(taskData);
        }
    };

    // 드래그 종료 핸들러
    const handleDragEnd = (event: DragEndEvent) => {
        if (includeArchived) {
            toast.warning("아카이브 보기 상태에서는 불가능한 동작입니다.");
            setActiveTask(null);
            return;
        }

        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const taskId = active.data.current?.taskId as number;
        const newStatus = over.id as TaskStatus;

        // 현재 태스크의 상태 확인
        const currentTask = findTaskById(taskId);
        if (!currentTask) return;

        // 같은 상태로 드롭하면 무시
        const currentStatus = getTaskStatus(taskId);
        if (currentStatus === newStatus) return;

        // 낙관적 업데이트를 위해 캐시 직접 수정
        queryClient.setQueryData(
            ["boardTasks", currentProject?.projectId, includeArchived],
            (
                oldData: ReturnType<typeof getBoardTasks> extends Promise<
                    infer T
                >
                    ? T
                    : never
            ) => {
                if (!oldData?.data) return oldData;

                const newData = { ...oldData, data: { ...oldData.data } };
                const statusKeys: Record<
                    MovableTaskStatus,
                    keyof typeof newData.data
                > = {
                    TODO: "todo",
                    IN_PROGRESS: "inProgress",
                    COMPLETED: "completed",
                };

                // 기존 상태에서 제거
                const sourceKey =
                    statusKeys[currentStatus as MovableTaskStatus];
                newData.data[sourceKey] = (newData.data[sourceKey] ?? []).filter(
                    (t: BoardTaskItem) => t.taskId !== taskId
                );

                // 새 상태에 추가
                const destKey = statusKeys[newStatus as MovableTaskStatus];
                const taskToMove = (oldData.data[sourceKey] ?? []).find(
                    (t: BoardTaskItem) => t.taskId === taskId
                );
                if (taskToMove) {
                    newData.data[destKey] = [
                        ...(newData.data[destKey] ?? []),
                        { ...taskToMove, status: newStatus },
                    ];
                }

                return newData;
            }
        );

        // API 호출
        statusMutation.mutate({ taskId, status: newStatus });
    };

    // 디버깅용: 에러 발생 시 콘솔 출력
    if (isError) {
        console.error("Task 조회 에러:", error);
    }

    // API 응답을 StateDataProps로 변환하는 헬퍼 함수
    const toStateData = (task: BoardTaskItem): StateDataProps => ({
        taskId: task.taskId,
        title: task.title,
        label: {
            labelName: task.priority,
            color:
                task.priority === "HIGH"
                    ? "RED"
                    : task.priority === "MEDIUM"
                    ? "YELLOW"
                    : "GRAY",
        },
        assigneeProfileImageUrl: task.assigneeProfileImageUrl,
        participantProfileImageUrls: task.participantProfileImageUrls,
        commentCount: task.commentCount,
    });

    // 검색 필터 적용된 boardData
    const boardData: BoardData = useMemo(() => {
        const todoTasks = tasksResponse?.data?.todo?.map(toStateData) ?? [];
        const inProgressTasks =
            tasksResponse?.data?.inProgress?.map(toStateData) ?? [];
        const completedTasks =
            tasksResponse?.data?.completed?.map(toStateData) ?? [];
        const archivedTasks =
            tasksResponse?.data?.archived?.map(toStateData) ?? [];

        // 검색 필터 함수
        const filterTasks = (tasks: StateDataProps[]) => {
            if (!searchValue) return tasks;
            const lowerSearch = searchValue.toLowerCase();

            return tasks.filter((task) => {
                switch (filterType) {
                    case "title":
                        return task.title.toLowerCase().includes(lowerSearch);
                    case "priority":
                        return task.label.labelName
                            .toLowerCase()
                            .includes(lowerSearch);
                    case "assignee":
                        // "unassigned" 또는 "미배정" 검색 시 미배정 태스크 반환
                        if (
                            lowerSearch === "unassigned" ||
                            lowerSearch === "미배정"
                        ) {
                            return (
                                !task.assigneeProfileImageUrl &&
                                task.participantProfileImageUrls.length === 0
                            );
                        }
                        // 그 외에는 담당자가 있는 태스크만 반환
                        return (
                            !!task.assigneeProfileImageUrl ||
                            task.participantProfileImageUrls.length > 0
                        );
                    case "all":
                    default:
                        // 전체: 제목 또는 중요도에서 검색
                        return (
                            task.title.toLowerCase().includes(lowerSearch) ||
                            task.label.labelName
                                .toLowerCase()
                                .includes(lowerSearch)
                        );
                }
            });
        };

        return {
            todo: filterTasks(todoTasks),
            inProgress: filterTasks(inProgressTasks),
            completed: filterTasks(completedTasks),
            archived: filterTasks(archivedTasks),
        };
    }, [tasksResponse, searchValue, filterType]);

    // 검색 핸들러
    const handleSearch = (value: string) => {
        setSearchValue(value);
    };

    return (
        <>
            <main>
                <PageHeader
                    className="px-14"
                    left="Board"
                    center={
                        <div className="flex items-center">
                            <VerticalDropbox
                                options={filterOptions}
                                checkValue={filterType}
                                onChange={setFilterType}
                                className="mr-2 py-4.5 w-28"
                            />
                            <Input
                                search
                                placeholder="Search"
                                className="w-64"
                                onSearch={handleSearch}
                                onClear={() => setSearchValue("")}
                            />
                        </div>
                    }
                    right={
                        <Button
                            label="+ task 생성"
                            size="sm"
                            className="font-bold px-4"
                            onClick={() => setIsTaskEditorModalOpen(true)}
                        />
                    }
                />
                <label className="px-14 flex items-center justify-end gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={includeArchived}
                        onChange={(e) => setIncludeArchived(e.target.checked)}
                    />
                    아카이브 보기
                </label>
                <div className="w-full mx-auto px-20 pt-4 flex gap-8 xl:gap-16 justify-between">
                    {!currentProject ? (
                        <div className="w-full text-center py-10 text-gray-500">
                            프로젝트를 선택해주세요.
                        </div>
                    ) : isLoading ? (
                        <div className="w-full text-center py-10 text-gray-500">
                            로딩 중...
                        </div>
                    ) : isError ? (
                        <div className="w-full text-center py-10 text-red-500">
                            Task 목록을 불러오는데 실패했습니다.
                            <button
                                onClick={() => refetch()}
                                className="ml-2 underline hover:text-red-700"
                            >
                                다시 시도
                            </button>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            onDragStart={handleDragStart}
                            onDragEnd={handleDragEnd}
                        >
                            <StateSection
                                status="To do"
                                statusKey="TODO"
                                tasks={boardData.todo}
                                onTaskCreate={() =>
                                    setIsTaskEditorModalOpen(true)
                                }
                                dndDisabled={includeArchived}
                            />
                            <StateSection
                                status="In Progress"
                                statusKey="IN_PROGRESS"
                                tasks={boardData.inProgress}
                                onTaskCreate={() =>
                                    setIsTaskEditorModalOpen(true)
                                }
                                dndDisabled={includeArchived}
                            />
                            <StateSection
                                status="Completed"
                                statusKey="COMPLETED"
                                tasks={boardData.completed}
                                onTaskCreate={() =>
                                    setIsTaskEditorModalOpen(true)
                                }
                                dndDisabled={includeArchived}
                            />
                            {includeArchived && (
                                <StateSection
                                    status="Archived"
                                    statusKey="ARCHIVED"
                                    tasks={boardData.archived}
                                    dndDisabled={true}
                                />
                            )}
                            <DragOverlay>
                                {activeTask ? (
                                    <div className="bg-white rounded-lg shadow-xl p-3 border-2 border-blue-400 opacity-90">
                                        <p className="font-medium">
                                            {activeTask.title}
                                        </p>
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    )}
                </div>
            </main>
            {currentProject && (
                <TaskCreateModal
                    isOpen={isTaskEditorModalOpen}
                    onClose={() => setIsTaskEditorModalOpen(false)}
                    projectId={currentProject.projectId}
                    onSuccess={() => {
                        refetch();
                    }}
                />
            )}
        </>
    );
};

export default Board;
