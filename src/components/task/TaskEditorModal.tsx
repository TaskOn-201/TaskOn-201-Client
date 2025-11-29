"use client";

import { useState } from "react";
import UserInfoModal from "../modal/UserInfoModal";
import Button from "../Button";
import { PenLine, Settings2, Tag, UserRound, UserStar } from "lucide-react";
import Label from "../Label";
import Profile from "../Profile";
import TaskPopoverSelect from "./TaskPopoverSelect";
import TaskParticipantSelect from "./TaskParticipantSelect";
import { Participant } from "../participant/type";
import { LABEL_OPTIONS } from "@/components/task/labelOptions";
import { LabelName } from "@/app/board/type";

type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

interface TaskEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const data: Participant[] = [
    {
        userId: 2,
        name: "홍길동",
        email: "aaa@example.com",
        profileImageUrl: "https://...",
        role: "LEADER",
    },
    {
        userId: 3,
        name: "김아무개",
        email: "bbb@example.com",
        profileImageUrl: "https://...",
        role: "MEMBER",
    },
];

const TaskEditorModal = ({ isOpen, onClose }: TaskEditorModalProps) => {
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState<TaskStatus | undefined>(undefined);
    const [label, setLabel] = useState<LabelName | undefined>(undefined);
    const [participantIds, setParticipantIds] = useState<number[]>([]);
    const [description, setDescription] = useState("");

    const submitHandler = () => {
        console.log("동작");
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
                            value={label}
                            onChange={setLabel}
                            placeholder="+ 중요도 선택"
                            options={LABEL_OPTIONS}
                        />
                    </div>
                    <span className="inline-flex items-center text-gray4">
                        <UserStar size={18} className="mr-2" /> 담당자
                    </span>
                    <div>
                        {/* 현재 담당자 - Task 만드는 사람 */}
                        <Label
                            text="Lee minjeong"
                            leftIcon={
                                <Profile
                                    className="size-4
                    "
                                />
                            }
                            variant="white"
                            size="sm"
                            className="py-1"
                        />
                    </div>
                    <span className="inline-flex items-center text-gray4">
                        <UserRound size={18} className="mr-2" /> 참여자
                    </span>
                    <div className="flex flex-wrap gap-2">
                        <TaskParticipantSelect
                            participants={data}
                            selectedUserIds={participantIds}
                            onChange={setParticipantIds}
                            placeholder="+ 참여자 선택"
                        />
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
                        variant="disable"
                        label="저장"
                        onClick={submitHandler}
                    />
                </div>
            </div>
        </UserInfoModal>
    );
};

export default TaskEditorModal;
