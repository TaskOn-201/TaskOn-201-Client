import { MeUser } from "@/lib/auth/authStorage";
import { CommentData } from "@/lib/comment/commentApi";
import Profile from "../Profile";
import Button from "../Button";
import { EllipsisVertical } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { dateFormatted } from "./CommentList";

interface CommentItemProps {
    me: MeUser;
    comment: CommentData;
    isEditing: boolean;
    isSaving: boolean;
    editingContent: string;
    onEditStart: () => void;
    onChange: (value: string) => void;
    onSave: () => void;
    onCancel: () => void;
    onDelete: () => void;
}

const CommentItem = ({
    me,
    comment,
    isEditing,
    isSaving,
    editingContent,
    onEditStart,
    onChange,
    onSave,
    onCancel,
    onDelete,
}: CommentItemProps) => {
    const isMe = comment.author.userId === me.userId;

    return (
        <li key={comment.commentId} className="flex gap-4 pt-2 pb-4 border-b border-b-gray1/40 last:border-0">
            <div className="mt-3">
                <Profile size="sm" imageUrl={comment.author.profileImageUrl} />
            </div>
            <div className="w-full flex">
                <div className="flex-1">
                    <div className="flex text-xs text-gray4 justify-between items-center gap-2 pb-1">
                        <div className="flex gap-1">
                            <p className="text-center">{comment.author.name}</p>
                            {"·"}
                            <span className="">
                                {dateFormatted(comment.createdAt)}
                            </span>
                            {comment.updatedAt !== comment.createdAt && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <span className="text-gray-500">
                                                (수정됨)
                                            </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="text-xs leading-5">
                                            <div>
                                                작성:{" "}
                                                {dateFormatted(
                                                    comment.createdAt
                                                )}
                                            </div>
                                            <div>
                                                수정:{" "}
                                                {dateFormatted(
                                                    comment.updatedAt
                                                )}
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                        <div>
                            {isMe && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            icon={
                                                <EllipsisVertical
                                                    size={12}
                                                    className="text-gray5"
                                                />
                                            }
                                            className="bg-white hover:bg-white p-1"
                                        />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="center"
                                        className="min-w-8"
                                    >
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Button
                                                label="수정"
                                                className="bg-transparent hover:bg-transparent text-gray5 p-0"
                                                onClick={onEditStart}
                                            />
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Button
                                                label="삭제"
                                                className="bg-transparent hover:bg-transparent text-red-500 focus:text-red-500 p-0"
                                                onClick={onDelete}
                                            />
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>

                    {/* 앵커랑 수정편집 */}
                    <div className="relative min-h-11">
                        <p
                            className={`text-sm whitespace-pre-wrap ${
                                isEditing ? "opacity-0" : "opacity-100"
                            }`}
                        >
                            {comment.content}
                        </p>
                        {isEditing && (
                            <div className="absolute inset-0 bg-white">
                                <textarea
                                    value={editingContent}
                                    onChange={(e) =>
                                        onChange(e.target.value)
                                    }
                                    className="w-full h-full border rounded-md px-3 py-3 text-sm resize-none"
                                    disabled={isSaving}
                                    autoFocus
                                />
                                {isSaving && (
                                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-md">
                                        <span className="text-sm text-gray-500 animate-pulse">
                                            저장 중…
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <div className="mt-2 flex gap-2 justify-end relative z-10">
                            <Button
                                label={isSaving ? "저장 중…" : "저장"}
                                onClick={onSave}
                                disabled={isSaving}
                                className="px-1.5 text-sm"
                            />
                            <Button
                                label="취소"
                                onClick={onCancel}
                                variant="disable"
                                disabled={isSaving}
                                className="px-1.5 text-sm"
                            />
                        </div>
                    )}
                </div>
            </div>
        </li>
    );
};

export default CommentItem;
