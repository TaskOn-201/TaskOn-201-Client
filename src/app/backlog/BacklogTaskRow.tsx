"use client";

import Profile from "@/components/Profile";
import Label from "@/components/Label";
import { LabelVariant } from "@/components/Label";
import TaskViewerModal from "@/components/task/TaskViewerModal";
import { useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";

export interface BacklogLabel {
  name: string;
  variant: LabelVariant;
}

export interface BacklogTaskData {
  taskId: number;
  title: string;
  assigneeProfileImageUrl: string | null;
  participantProfileImageUrls: string[];
  labels: BacklogLabel[];
  isUnassigned?: boolean;
}

interface BacklogTaskRowProps {
  task: BacklogTaskData;
  onUpdate?: () => void;
}

const BacklogTaskRow = ({ task, onUpdate }: BacklogTaskRowProps) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const { currentProject } = useProjectStore();

  const {
    title,
    assigneeProfileImageUrl,
    participantProfileImageUrls,
    labels,
    isUnassigned,
  } = task;

  // 모든 프로필 이미지 합치기 (담당자 + 참여자)
  const allProfiles = [
    ...(assigneeProfileImageUrl ? [assigneeProfileImageUrl] : []),
    ...participantProfileImageUrls,
  ].slice(0, 3);

  return (
    <>
      <div
        className="flex items-center justify-between py-3 px-4 bg-white border-l-4 border-l-main rounded-lg cursor-pointer hover:bg-gray1/50 transition-colors"
        onClick={() => setIsViewerOpen(true)}
      >
        {/* 왼쪽: 제목 (위) & 담당자 (아래) */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <p className="text-gray5 font-medium truncate">{title}</p>

          {/* 담당자/참여자 아바타 */}
          <div className="flex items-center -space-x-2">
            {allProfiles.length > 0 ? (
              allProfiles.map((url, index) => (
                <Profile
                  key={index}
                  imageUrl={url}
                  size="sm"
                  className="size-7 border-2 border-white"
                />
              ))
            ) : isUnassigned ? (
              <span className="text-xs text-gray3">Unassigned</span>
            ) : null}
          </div>
        </div>

        {/* 오른쪽: 라벨들 */}
        <div className="flex items-center gap-2 shrink-0">
          {labels.map((label, index) => (
            <Label
              key={index}
              text={label.name}
              variant={label.variant}
              size="xs"
            />
          ))}
        </div>
      </div>

      {currentProject && (
        <TaskViewerModal
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            onUpdate?.();
          }}
          projectId={currentProject.projectId}
          taskId={task.taskId}
        />
      )}
    </>
  );
};

export default BacklogTaskRow;
