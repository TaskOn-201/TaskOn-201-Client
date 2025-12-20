import { TaskDetailData } from "@/lib/task/taskApi";
import CommentInput from "./comment-components/CommentInput";
import useMe from "@/lib/user/useMe";
import { useState } from "react";
import CommentList from "./comment-components/CommentList";
import { useTaskComment } from "@/lib/comment/useTaskComment";

interface CommentProps {
    projectId: number;
    taskId: number;
    task?: TaskDetailData;
}

const Comment = ({ projectId, taskId, task }: CommentProps) => {
    const { data: me } = useMe();
    const [commentContent, setCommentContent] = useState("");
    const {
        comments,
        isLoading,
        isError,
        createComment,
        updateComment,
        deleteComment,
    } = useTaskComment({ projectId, taskId });

    const handleCreateComment = () => {
        if (!commentContent.trim()) return;
        createComment.mutate(commentContent, {
            onSuccess: () => setCommentContent(""),
        });
    };

    const handleUpdateComment = (commentId: number, content: string) => {
        return updateComment.mutateAsync({ commentId, content });
    };

    const handleDeleteComment = (commentId: number) => {
        deleteComment.mutate(commentId);
    };

    {
        /* 현재 로그인 상태이며, task 참여자인지 확인 */
    }
    const isTaskMemberCheck =
        (!!me && me.userId === task?.assignee?.userId) ||
        task?.participants?.some((p) => p.userId === me?.userId);

    if (!me) return <></>;
    if (isLoading) return <div>comment 불러오는중...</div>;
    if (isError) return <div>comment를 불러오는데 실패하였습니다, 다시 task를 열어주세요</div>;

    return (
        <div>
            <CommentInput
                me={me}
                value={commentContent}
                onChange={setCommentContent}
                onSubmit={handleCreateComment}
                disabled={
                    !isTaskMemberCheck ||
                    createComment.isPending ||
                    !commentContent.trim()
                }
            />
            {!isLoading && (
                <CommentList
                    me={me}
                    comments={comments}
                    handleUpdateComment={handleUpdateComment}
                    handleDeleteComment={handleDeleteComment}
                />
            )}
        </div>
    );
};

export default Comment;
