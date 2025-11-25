export type Priority = "HIGH" | "MEDIUM" | "LOW";

export interface StateDataProps {
    taskId: number;
    title: string;
    priority: Priority;
    assigneeProfileImageUrl: string;
    participantProfileImageUrls: string[];
    commentCount: number;
}