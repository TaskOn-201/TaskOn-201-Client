import {
  CalendarDays,
  PenLine,
  Settings2,
  Tag,
  Trash,
  UserRound,
  UserStar,
} from "lucide-react";
import Label from "../Label";
import UserInfoModal from "../modal/UserInfoModal";
import Profile from "../Profile";
import Button from "../Button";
import { TaskPriority } from "@/lib/task/taskApi";
import { useTaskDetail } from "@/lib/task/useTaskDetail";
import { LABEL_OPTIONS } from "./labelOptions";

interface TaskViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  taskId: number;
}

// Priority에 따른 Label variant 매핑
const getPriorityVariant = (priority: TaskPriority) => {
  const option = LABEL_OPTIONS.find((opt) => opt.value === priority);
  return option?.variant;
};

// Status 표시 텍스트
const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    TODO: "To do",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
  };
  return statusMap[status] ?? status;
};

const TaskViewerModal = ({
  isOpen,
  onClose,
  projectId,
  taskId,
}: TaskViewerModalProps) => {
  const { task, isLoading, deleteTask } = useTaskDetail({
    projectId,
    taskId,
    enabled: isOpen,
  });

  const handleDeleteTask = () => {
    deleteTask(onClose);
  };
  return (
    <UserInfoModal
      isOpen={isOpen}
      onClose={onClose}
      title={task?.title ?? "업무 상세"}
      className="max-w-2xl max-h-[800px] overflow-y-auto"
    >
      {isLoading ? (
        <div className="py-10 text-center text-gray-500">로딩 중...</div>
      ) : !task ? (
        <div className="py-10 text-center text-gray-500">
          Task를 불러올 수 없습니다.
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-[80px_1fr] gap-x-10 gap-y-4 pb-6 border-b">
            <span className="inline-flex items-center text-gray4">
              <Settings2 size={18} className="mr-2" /> 상태
            </span>
            <div>
              <Label
                text={getStatusLabel(task.status)}
                variant="white"
                size="sm"
                className="py-1"
              />
            </div>
            <span className="inline-flex items-center text-gray4">
              <Tag size={18} className="mr-2" /> 중요도
            </span>
            <div>
              <Label
                text={task.priority}
                variant={getPriorityVariant(task.priority)}
                size="sm"
                className="py-1"
              />
            </div>
            <span className="inline-flex items-center text-gray4">
              <UserStar size={18} className="mr-2" /> 담당자
            </span>
            <div>
              {task.assignee ? (
                <Label
                  text={task.assignee.name}
                  leftIcon={
                    <Profile
                      imageUrl={task.assignee.profileImageUrl ?? undefined}
                      userName={task.assignee.name}
                      className="size-4"
                    />
                  }
                  variant="white"
                  size="sm"
                  className="py-1"
                />
              ) : (
                <span className="text-sm text-gray4">담당자 없음</span>
              )}
            </div>
            <span className="inline-flex items-center text-gray4">
              <UserRound size={18} className="mr-2" /> 참여자
            </span>
            <div className="flex flex-wrap gap-2">
              {task.participants.length > 0 ? (
                task.participants.map((participant) => (
                  <Label
                    key={participant.userId}
                    text={participant.name}
                    leftIcon={
                      <Profile
                        imageUrl={participant.profileImageUrl ?? undefined}
                        userName={participant.name}
                        className="size-4"
                      />
                    }
                    variant="white"
                    size="sm"
                    className="py-1"
                  />
                ))
              ) : (
                <span className="text-sm text-gray4">참여자 없음</span>
              )}
            </div>
            <span className="inline-flex items-center text-gray4">
              <CalendarDays size={18} className="mr-2" /> 기간
            </span>
            <div className="text-sm">
              {task.startDate && task.dueDate ? (
                <span>
                  {task.startDate} ~ {task.dueDate}
                </span>
              ) : (
                <span className="text-gray4">기간 미설정</span>
              )}
            </div>
          </div>
          <div className="min-h-[200px] pt-4 border-b">
            <span className="inline-block text-gray4 pb-2">설명</span>
            <p className="text-sm text-gray5">
              {task.description || "설명이 없습니다."}
            </p>
          </div>
          <div className="flex justify-end gap-2 pt-5">
            <Button
              icon={<PenLine size={14} />}
              variant="primary"
              label="수정"
            />
            <Button
              icon={<Trash size={14} />}
              variant="disable"
              label="삭제"
              onClick={handleDeleteTask}
            />
          </div>
        </div>
      )}
      {/* 댓글 예시 */}
      {/* <div>
                <div className="px-2 py-4 grid grid-cols-[40px_1fr_50px] gap-x-4 items-center">
                  <Profile size="sm" />
                  <Input />
                  <Button icon={<Send size={20} color="white" />} variant="primary"  />
                </div>
                <div className="pl-2 py-4">
                  <h3 className="text-lg font-bold">COMMENT</h3>
                  <div className="flex gap-4 py-2">
                    <div className="mt-3">
                       <Profile size="sm" />
                    </div>
                    <div>
                      <span className="text-xs text-gray3">2025-11-13 12:00:00</span>
                      <p className="text-sm">확인했습니다, 추가적으로 더 회의를 진행해봐야겠습니다. 확인했습니다, 추가적으로 더 회의를 진행해봐야겠습니다.확인했습니다, 추가적으로 더 회의를 진행해봐야겠습니다.확인했습니다, 추가적으로 더 회의를 진행해봐야겠습니다.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 py-2">
                    <div className="mt-3">
                       <Profile size="sm" />
                    </div>
                    <div>
                      <span className="text-xs text-gray3">2025-11-13 12:00:00</span>
                      <p className="text-sm">확인했습니다, 추가적으로 더 회의를 진행해봐야겠습니다. 확인했습니다, 추가적으로 더 회의를 진행해봐야겠습니다.확인했습니다, 추가적으로 더 회의를 진행해봐야겠습니다.확인했습니다, 추가적으로 더 회의를 진행해봐야겠습니다.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 py-2">
                    <div className="mt-3">
                       <Profile size="sm" />
                    </div>
                    <div>
                      <span className="text-xs text-gray3">2025-11-13 12:00:00</span>
                      <p className="text-sm">확인했습니다, 추가적으로 더 회의를 진행해봐야겠습니다. 확인했습니다, 추가적으로 더 회의를 진행해봐야겠습니다.확인했습니다, 추가적으로 더 회의를 진행해봐야겠습니다.확인했습니다, 추가적으로 더 회의를 진행해봐야겠습니다.</p>
                    </div>
                  </div>
                </div>
            </div> */}
    </UserInfoModal>
  );
};

export default TaskViewerModal;
