"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
    CalendarDays,
    PenLine,
    Settings2,
    Tag,
    Trash,
    UserRound,
    UserStar,
    X,
} from "lucide-react";
import Label from "../Label";
import UserInfoModal from "../modal/UserInfoModal";
import Profile from "../Profile";
import Button from "../Button";
import {
    TaskPriority,
    TaskStatus,
    updateTaskRequest,
} from "@/lib/task/taskApi";
import { useTaskDetail } from "@/lib/task/useTaskDetail";
import { LABEL_OPTIONS } from "./labelOptions";
import Comment from "../Comment";
import TaskPopoverSelect from "./TaskPopoverSelect";
import TaskParticipantSelect from "./TaskParticipantSelect";
import { Participant } from "../participant/type";
import {
    getProjectMembersRequest,
    ProjectMember,
} from "@/lib/project/projectApi";
import { toast } from "sonner";
import useMe from "@/lib/user/useMe";

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
    const queryClient = useQueryClient();
    const { task, isLoading, deleteTask, refetch } = useTaskDetail({
        projectId,
        taskId,
        enabled: isOpen,
    });

    console.log(taskId, projectId);

    // 편집 모드 상태
    const [isEditing, setIsEditing] = useState(false);

    // 편집용 상태
    const [editTitle, setEditTitle] = useState("");
    const [editStatus, setEditStatus] = useState<TaskStatus | undefined>();
    const [editPriority, setEditPriority] = useState<
        TaskPriority | undefined
    >();
    const [editParticipantIds, setEditParticipantIds] = useState<number[]>([]);
    const [editStartDate, setEditStartDate] = useState("");
    const [editDueDate, setEditDueDate] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // 프로젝트 멤버 상태
    // const [leader, setLeader] = useState<ProjectMember | null>(null);
    const [members, setMembers] = useState<Participant[]>([]);
    const [isMembersLoading, setIsMembersLoading] = useState(false);
    const { data: me } = useMe();

    // 편집 모드 진입 시 현재 데이터로 초기화
    useEffect(() => {
        if (isEditing && task) {
            setEditTitle(task.title);
            setEditStatus(task.status);
            setEditPriority(task.priority);
            setEditParticipantIds(task.participants.map((p) => p.userId));
            setEditStartDate(task.startDate ?? "");
            setEditDueDate(task.dueDate ?? "");
            setEditDescription(task.description ?? "");
        }
    }, [isEditing, task]);

    // 프로젝트 멤버 조회 (편집 모드일 때만)
    useEffect(() => {
        if (!isEditing || !projectId) return;

        const fetchMembers = async () => {
            setIsMembersLoading(true);
            try {
                const response = await getProjectMembersRequest(projectId);
                const projectMembers = response.data;

                // const leaderMember = projectMembers.find(
                //   (member) => member.role === "LEADER"
                // );
                // setLeader(leaderMember || null);

                const memberParticipants: Participant[] = projectMembers
                    .filter((member) => member.userId !== me?.userId)
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
    }, [isEditing, projectId, me?.userId]);

    // 모달이 닫힐 때 편집 모드 초기화
    useEffect(() => {
        if (!isOpen) {
            setIsEditing(false);
        }
    }, [isOpen]);

    const handleDeleteTask = () => {
        deleteTask(onClose);
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const isFormValid =
        editTitle.trim() !== "" &&
        editStatus &&
        editPriority &&
        editStartDate &&
        editDueDate;

    const handleSaveEdit = async () => {
        if (!isFormValid) {
            toast.error("제목, 상태, 중요도, 시작일, 마감일을 입력해주세요.");
            return;
        }

        setIsSaving(true);
        try {
            await updateTaskRequest(projectId, taskId, {
                title: editTitle.trim(),
                status: editStatus!,
                priority: editPriority!,
                participantIds: editParticipantIds,
                startDate: editStartDate,
                dueDate: editDueDate,
                description: editDescription.trim() || undefined,
            });

            toast.success("Task가 수정되었습니다.");
            setIsEditing(false);
            refetch();
            queryClient.invalidateQueries({
                queryKey: ["boardTasks", projectId],
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Task 수정에 실패했습니다.";
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const canAssigneeEdit =
        !!me?.userId &&
        !!task?.assignee?.userId &&
        task.assignee.userId === me.userId;

    return (
        <UserInfoModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? undefined : task?.title ?? "업무 상세"}
            titleNode={
                isEditing ? (
                    <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="업무 제목을 입력하세요"
                        className="w-full text-lg font-bold outline-none"
                    />
                ) : undefined
            }
            className="max-w-2xl max-h-[800px] overflow-y-auto"
        >
            {isLoading ? (
                <div className="py-10 text-center text-gray-500">
                    로딩 중...
                </div>
            ) : !task ? (
                <div className="py-10 text-center text-gray-500">
                    Task를 불러올 수 없습니다.
                </div>
            ) : isEditing ? (
                /* 편집 모드 UI */
                <div>
                    <div className="grid grid-cols-[80px_1fr] gap-x-10 gap-y-4 pb-6 border-b">
                        <span className="inline-flex items-center text-gray4">
                            <Settings2 size={18} className="mr-2" /> 상태
                        </span>
                        <div>
                            <TaskPopoverSelect
                                value={editStatus}
                                onChange={setEditStatus}
                                placeholder="+ 상태 선택"
                                variant="white"
                                options={[
                                    { value: "TODO", label: "To do" },
                                    {
                                        value: "IN_PROGRESS",
                                        label: "In Progress",
                                    },
                                    { value: "COMPLETED", label: "Completed" },
                                ]}
                            />
                        </div>
                        <span className="inline-flex items-center text-gray4">
                            <Tag size={18} className="mr-2" /> 중요도
                        </span>
                        <div>
                            <TaskPopoverSelect
                                value={editPriority}
                                onChange={setEditPriority}
                                placeholder="+ 중요도 선택"
                                options={LABEL_OPTIONS}
                            />
                        </div>
                        <span className="inline-flex items-center text-gray4">
                            <UserStar size={18} className="mr-2" /> 담당자
                        </span>
                        <div>
                            {isMembersLoading ? (
                                <span className="text-sm text-gray4">
                                    불러오는 중...
                                </span>
                            ) : me ? (
                                <Label
                                    text={me.name}
                                    leftIcon={
                                        <Profile
                                            imageUrl={me.profileImageUrl}
                                            userName={me.name.charAt(0)}
                                            className="size-4"
                                        />
                                    }
                                    variant="white"
                                    size="sm"
                                    className="py-1"
                                />
                            ) : (
                                <span className="text-sm text-gray4">
                                    담당자 없음
                                </span>
                            )}
                        </div>
                        <span className="inline-flex items-center text-gray4">
                            <UserRound size={18} className="mr-2" /> 참여자
                        </span>
                        <div className="flex flex-wrap gap-2">
                            {isMembersLoading ? (
                                <span className="text-sm text-gray4">
                                    불러오는 중...
                                </span>
                            ) : members.length > 0 ? (
                                <TaskParticipantSelect
                                    participants={members}
                                    selectedUserIds={editParticipantIds}
                                    onChange={setEditParticipantIds}
                                    placeholder="+ 참여자 선택"
                                />
                            ) : (
                                <span className="text-sm text-gray4">
                                    참여 가능한 멤버가 없습니다
                                </span>
                            )}
                        </div>
                        <span className="inline-flex items-center text-gray4">
                            <CalendarDays size={18} className="mr-2" /> 시작일
                        </span>
                        <div>
                            <input
                                type="date"
                                value={editStartDate}
                                onChange={(e) =>
                                    setEditStartDate(e.target.value)
                                }
                                className="px-3 py-1.5 text-sm border border-gray2 rounded-md outline-none focus:border-primary"
                            />
                        </div>
                        <span className="inline-flex items-center text-gray4">
                            <CalendarDays size={18} className="mr-2" /> 마감일
                        </span>
                        <div>
                            <input
                                type="date"
                                value={editDueDate}
                                onChange={(e) => setEditDueDate(e.target.value)}
                                min={editStartDate}
                                className="px-3 py-1.5 text-sm border border-gray2 rounded-md outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="min-h-[200px] pt-4 border-b">
                        <span className="block text-gray4 pb-2">설명</span>
                        <textarea
                            placeholder="여기에 설명을 적어주세요"
                            className="inline-flex text-sm text-gray5 w-full min-h-[140px] outline-none resize-none"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-5">
                        <Button
                            icon={<X size={14} />}
                            variant="disable"
                            label="취소"
                            onClick={handleCancelEdit}
                        />
                        <Button
                            icon={<PenLine size={14} />}
                            variant={
                                isFormValid && !isSaving ? "primary" : "disable"
                            }
                            label={isSaving ? "저장 중..." : "저장"}
                            onClick={handleSaveEdit}
                            disabled={!isFormValid || isSaving}
                        />
                    </div>
                </div>
            ) : (
                /* 보기 모드 UI */
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
                                            imageUrl={
                                                task.assignee.profileImageUrl ??
                                                undefined
                                            }
                                            userName={
                                                task.assignee.name.charAt(0) ??
                                                "탈퇴한 사용자"
                                            }
                                            className="size-4"
                                        />
                                    }
                                    variant="white"
                                    size="sm"
                                    className="py-1"
                                />
                            ) : (
                                <span className="text-sm text-gray4">
                                    담당자 없음
                                </span>
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
                                                imageUrl={
                                                    participant.profileImageUrl ??
                                                    undefined
                                                }
                                                userName={
                                                    participant.name.charAt(
                                                        0
                                                    ) ?? "탈퇴한 사용자"
                                                }
                                                className="size-4"
                                            />
                                        }
                                        variant="white"
                                        size="sm"
                                        className="py-1"
                                    />
                                ))
                            ) : (
                                <span className="text-sm text-gray4">
                                    참여자 없음
                                </span>
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
                        <span className="inline-block text-gray4 pb-2">
                            설명
                        </span>
                        <p className="text-sm text-gray5">
                            {task.description || "설명이 없습니다."}
                        </p>
                    </div>
                    {canAssigneeEdit && (
                        <div className="flex justify-end gap-2 pt-5">
                            <Button
                                icon={<PenLine size={14} />}
                                variant="primary"
                                label="수정"
                                onClick={handleEditClick}
                            />
                            <Button
                                icon={<Trash size={14} />}
                                variant="disable"
                                label="삭제"
                                onClick={handleDeleteTask}
                            />
                        </div>
                    )}
                </div>
            )}
            {/* 댓글 - 편집 모드가 아닐 때만 표시 */}
            {!isEditing && (
                <Comment projectId={projectId} taskId={taskId} task={task} />
            )}
        </UserInfoModal>
    );
};

export default TaskViewerModal;
