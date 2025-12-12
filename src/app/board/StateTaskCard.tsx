"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Label from "@/components/Label";
import Profile from "@/components/Profile";
import { MessageSquareText, Plus } from "lucide-react";
import { StateDataProps } from "./type";
import TaskDetailModal from "@/components/task/TaskViewerModal";
import { useState } from "react";
import { LABEL_OPTIONS } from "@/components/task/labelOptions";
import { useProjectStore } from "@/store/useProjectStore";

const StateTaskCard = (task: StateDataProps) => {
  const {
    taskId,
    title,
    label,
    assigneeProfileImageUrl,
    participantProfileImageUrls,
    commentCount,
  } = task;
  const [isTaskViewerModalOpen, setIsTaskViewerModalOpen] = useState(false);
  const { currentProject } = useProjectStore();

  const labelData = LABEL_OPTIONS.find(
    (option) => option.value === label.labelName
  );

  return (
    <>
      <li className="cursor-pointer">
        <Card
          className="px-0 py-3 "
          onClick={() => setIsTaskViewerModalOpen(true)}
        >
          <CardContent>
            <h4 className="mb-3 whitespace-nowrap overflow-hidden text-ellipsis">
              {title}
            </h4>
            <Label
              text={label.labelName}
              variant={labelData?.variant}
              size="sm"
            />
          </CardContent>

          <CardFooter className="flex justify-between text-gray3">
            <div className="flex items-center">
              <MessageSquareText size={18} className="mr-1.5" />
              <p>{commentCount}</p>
            </div>
            <div className="flex ml-4 items-center">
              {/* 담당자 - 항상 표시 */}
              {assigneeProfileImageUrl && (
                <Profile
                  imageUrl={assigneeProfileImageUrl}
                  className="size-8 border-4 border-white"
                />
              )}
              {/* 첫 번째 참여자 - 항상 표시 */}
              {participantProfileImageUrls.length >= 1 && (
                <Profile
                  imageUrl={participantProfileImageUrls[0]}
                  className="size-8 border-4 border-white"
                />
              )}
              {/* 두 번째 참여자 - xl 이상에서만 표시 */}
              {participantProfileImageUrls.length >= 2 && (
                <Profile
                  imageUrl={participantProfileImageUrls[1]}
                  className="size-8 border-4 border-white hidden xl:block"
                />
              )}
              {/* Plus 아이콘 - 작은 화면: 2명 이상, 큰 화면: 3명 이상 */}
              {participantProfileImageUrls.length >= 2 && (
                <Plus
                  size={14}
                  className={
                    participantProfileImageUrls.length > 2
                      ? "ml-1"
                      : "ml-1 xl:hidden"
                  }
                />
              )}
            </div>
          </CardFooter>
        </Card>
      </li>

      {currentProject && (
        <TaskDetailModal
          isOpen={isTaskViewerModalOpen}
          onClose={() => setIsTaskViewerModalOpen(false)}
          projectId={currentProject.projectId}
          taskId={taskId}
        />
      )}
    </>
  );
};

export default StateTaskCard;
