"use client";

import { useState, useEffect } from "react";
import UserInfoModal from "../modal/UserInfoModal";
import Button from "../Button";
import { PenLine, Settings2, Tag, UserRound, UserStar } from "lucide-react";
import Label from "../Label";
import Profile from "../Profile";
import TaskPopoverSelect from "./TaskPopoverSelect";
import TaskParticipantSelect from "./TaskParticipantSelect";
import { Participant } from "../participant/type";
import { LABEL_OPTIONS } from "@/components/task/labelOptions";
import {
  getProjectMembersRequest,
  ProjectMember,
} from "@/lib/project/projectApi";
import {
  createTaskRequest,
  TaskStatus,
  TaskPriority,
} from "@/lib/task/taskApi";
import { toast } from "sonner";

interface TaskEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  onSuccess?: () => void;
}

const TaskEditorModal = ({
  isOpen,
  onClose,
  projectId,
  onSuccess,
}: TaskEditorModalProps) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus | undefined>(undefined);
  const [priority, setPriority] = useState<TaskPriority | undefined>(undefined);
  const [participantIds, setParticipantIds] = useState<number[]>([]);
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 프로젝트 멤버 상태
  const [leader, setLeader] = useState<ProjectMember | null>(null);
  const [members, setMembers] = useState<Participant[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(false);

  // 프로젝트 멤버 조회
  useEffect(() => {
    if (!isOpen || !projectId) return;

    const fetchMembers = async () => {
      setIsMembersLoading(true);
      try {
        const response = await getProjectMembersRequest(projectId);
        const projectMembers = response.data;

        // LEADER 찾기
        const leaderMember = projectMembers.find(
          (member) => member.role === "LEADER"
        );
        setLeader(leaderMember || null);

        // MEMBER 역할만 필터링하여 참여자 목록으로 설정
        const memberParticipants: Participant[] = projectMembers
          .filter((member) => member.role === "MEMBER")
          .map((member) => ({
            userId: member.userId,
            name: member.name,
            email: member.email,
            profileImageUrl: member.profileImageUrl,
            role: member.role,
          }));
        setMembers(memberParticipants);
      } catch (error) {
        console.error("멤버 조회 실패:", error);
        toast.error("프로젝트 멤버를 불러오는데 실패했습니다.");
      } finally {
        setIsMembersLoading(false);
      }
    };

    fetchMembers();
  }, [isOpen, projectId]);

  const isFormValid = title.trim() !== "" && status && priority;

  const resetForm = () => {
    setTitle("");
    setStatus(undefined);
    setPriority(undefined);
    setParticipantIds([]);
    setDescription("");
  };

  const submitHandler = async () => {
    if (!isFormValid) {
      toast.error("제목, 상태, 중요도를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await createTaskRequest(projectId, {
        title: title.trim(),
        status: status!,
        priority: priority!,
        participantIds,
        description: description.trim() || undefined,
      });

      toast.success("Task가 생성되었습니다.");
      resetForm();
      onSuccess?.();
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Task 생성에 실패했습니다.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserInfoModal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl max-h-[800px] overflow-y-auto"
      titleNode={
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="업무 제목을 입력하세요"
          className="w-full text-lg font-bold outline-none"
        />
      }
    >
      <div>
        <div className="grid grid-cols-[80px_1fr] gap-x-10 gap-y-4 pb-6 border-b">
          <span className="inline-flex items-center text-gray4">
            <Settings2 size={18} className="mr-2" /> 상태
          </span>
          <div>
            <TaskPopoverSelect
              value={status}
              onChange={setStatus}
              placeholder="+ 상태 선택"
              variant="white"
              options={[
                { value: "TODO", label: "To do" },
                { value: "IN_PROGRESS", label: "In Progress" },
                { value: "COMPLETED", label: "Completed" },
              ]}
            />
          </div>
          <span className="inline-flex items-center text-gray4">
            <Tag size={18} className="mr-2" /> 중요도
          </span>
          <div>
            <TaskPopoverSelect
              value={priority}
              onChange={setPriority}
              placeholder="+ 중요도 선택"
              options={LABEL_OPTIONS}
            />
          </div>
          <span className="inline-flex items-center text-gray4">
            <UserStar size={18} className="mr-2" /> 담당자
          </span>
          <div>
            {isMembersLoading ? (
              <span className="text-sm text-gray4">불러오는 중...</span>
            ) : leader ? (
              <Label
                text={leader.name}
                leftIcon={
                  <Profile
                    imageUrl={leader.profileImageUrl}
                    userName={leader.name}
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
            {isMembersLoading ? (
              <span className="text-sm text-gray4">불러오는 중...</span>
            ) : members.length > 0 ? (
              <TaskParticipantSelect
                participants={members}
                selectedUserIds={participantIds}
                onChange={setParticipantIds}
                placeholder="+ 참여자 선택"
              />
            ) : (
              <span className="text-sm text-gray4">
                참여 가능한 멤버가 없습니다
              </span>
            )}
          </div>
        </div>
        <div className="min-h-[200px] pt-4 border-b">
          <span className="block text-gray4 pb-2">설명</span>
          <textarea
            placeholder="여기에 설명을 적어주세요"
            className="inline-flex text-sm text-gray5 w-full min-h-[140px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="flex justify-end gap-2 pt-5">
          <Button
            type="submit"
            icon={<PenLine size={14} />}
            variant={isFormValid && !isLoading ? "primary" : "disable"}
            label={isLoading ? "저장 중..." : "저장"}
            onClick={submitHandler}
            disabled={!isFormValid || isLoading}
          />
        </div>
      </div>
    </UserInfoModal>
  );
};

export default TaskEditorModal;
