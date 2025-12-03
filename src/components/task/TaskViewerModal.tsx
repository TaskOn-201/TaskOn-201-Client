import {
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

interface TaskViewerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TaskViewerModal = ({ isOpen, onClose }: TaskViewerModalProps) => {

    return (
        <UserInfoModal
            isOpen={isOpen}
            onClose={onClose}
            title={"새 업무"}
            className="max-w-2xl max-h-[800px] overflow-y-auto"
        >
            <div>
                <div className="grid grid-cols-[80px_1fr] gap-x-10 gap-y-4 pb-6 border-b">
                    <span className="inline-flex items-center text-gray4">
                        <Settings2 size={18} className="mr-2" /> 상태
                    </span>
                    <div>
                        <Label
                            text={"TODO"}
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
                            text="HIGH"
                            variant="red"
                            size="sm"
                            className="py-1"
                        />
                    </div>
                    <span className="inline-flex items-center text-gray4">
                        <UserStar size={18} className="mr-2" /> 담당자
                    </span>
                    <div>
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
                </div>
                <div className="min-h-[200px] pt-4 border-b">
                    <span className="inline-block text-gray4 pb-2">설명</span>
                    <p className="text-sm text-gray5">
                    </p>
                </div>
                <div className="flex justify-end gap-2 pt-5">
                    <Button
                        icon={<PenLine size={14} />}
                        variant="disable"
                        label="수정"
                    />
                    <Button
                        icon={<Trash size={14} />}
                        variant="disable"
                        label="삭제"
                    />
                </div>
            </div>
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
