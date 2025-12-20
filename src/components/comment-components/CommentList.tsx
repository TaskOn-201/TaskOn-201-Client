import { CommentData } from "@/lib/comment/commentApi";
import { useState } from "react";
import { MeUser } from "@/lib/auth/authStorage";
import CommentItem from "./CommentItem";

interface CommentListProps {
    me: MeUser;
    comments?: CommentData[];
    handleUpdateComment: (
        commentId: CommentData["commentId"],
        content: CommentData["content"]
    ) => Promise<void>;
    handleDeleteComment: (commentId: CommentData["commentId"]) => void;
}

// 날짜 포맷
export const dateFormatted = (value: string) => {
    const date = new Date(value);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const CommentList = ({
    me,
    comments,
    handleUpdateComment,
    handleDeleteComment,
}: CommentListProps) => {
    const [editingCommentId, setEditingCommentId] = useState<number | null>(
        null
    );
    const [editingContent, setEditingContent] = useState<string>("");
    const [savingCommentId, setSavingCommentId] = useState<number | null>(null);

    // 수정 시
    const startEdit = (commentId: number, content: string) => {
        setEditingCommentId(commentId);
        setEditingContent(content);
    };

    // 취소 시
    const cancelEdit = () => {
        setEditingCommentId(null);
        setEditingContent("");
    };

    // 수정 입력 후 저장
    const UpdateSave = async (commentId: number) => {
        const content = editingContent.trim();

        setSavingCommentId(commentId);

        try {
            await handleUpdateComment(commentId, content);
            setEditingCommentId(null);
            setEditingContent("");
        } finally {
            setSavingCommentId(null);
        }
    };

    return (
        <div className="pl-2 pt-4">
            <h3 className="text-2xl font-bold mb-2">COMMENT</h3>
            <ul>
                {comments && comments.length > 0 ? (
                    comments?.map((comment) => (
                        <CommentItem
                            key={comment.commentId}
                            me={me}
                            comment={comment}
                            isEditing={editingCommentId === comment.commentId}
                            isSaving={savingCommentId === comment.commentId}
                            editingContent={editingContent}
                            onEditStart={() =>
                                startEdit(comment.commentId, comment.content)
                            }
                            onChange={setEditingContent}
                            onSave={() => UpdateSave(comment.commentId)}
                            onCancel={cancelEdit}
                            onDelete={() =>
                                handleDeleteComment(comment.commentId)
                            }
                        />
                    ))
                ) : (
                    <li className="mt-2 text-sm text-gray5">등록된 comment가 없습니다.</li>
                )}
            </ul>
        </div>
    );
};

export default CommentList;
