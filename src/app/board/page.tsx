"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import PageHeader from "@/components/PageHeader";
import VerticalDropbox from "@/components/VerticalDropbox";
import StateSection from "./StateSection";
import { StateDataProps } from "./type";
import { useState } from "react";
import TaskCreateModal from "@/components/task/TaskEditorModal";
import { useProjectStore } from "@/store/useProjectStore";
import { useQuery } from "@tanstack/react-query";
import { getBoardTasks, BoardTaskItem } from "@/lib/task/taskApi";

const options = [
  {
    label: "제목",
    value: "title",
  },
  {
    label: "중요도",
    value: "priority",
  },
  {
    label: "사용자명",
    value: "name",
  },
];

type BoardData = {
  todo: StateDataProps[];
  inProgress: StateDataProps[];
  completed: StateDataProps[];
};

const Board = () => {
  const [isTaskEditorModalOpen, setIsTaskEditorModalOpen] = useState(false);
  const { currentProject } = useProjectStore();

  // Task 보드 조회
  const {
    data: tasksResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["boardTasks", currentProject?.projectId],
    queryFn: () => getBoardTasks(currentProject!.projectId),
    enabled: !!currentProject?.projectId,
  });

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

  // API 응답 데이터 (이미 상태별로 분류됨)
  const boardData: BoardData = {
    todo: tasksResponse?.data?.todo?.map(toStateData) ?? [],
    inProgress: tasksResponse?.data?.inProgress?.map(toStateData) ?? [],
    completed: tasksResponse?.data?.completed?.map(toStateData) ?? [],
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
                options={options}
                className="mr-2 py-4.5 size-26"
              />
              <Input search />
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
            <>
              <StateSection status="To do" tasks={boardData.todo} />
              <StateSection status="In Progress" tasks={boardData.inProgress} />
              <StateSection status="Completed" tasks={boardData.completed} />
            </>
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
