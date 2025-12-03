export type LabelName = "HIGH" | "MEDIUM" | "LOW";
export type LabelColorType = "RED" | "YELLOW" | "GRAY";
export interface LabelItem {
  labelName: LabelName;
  color: LabelColorType;
}

export interface StateDataProps {
    taskId: number;
    title: string;
    label: LabelItem;
    assigneeProfileImageUrl: string;
    participantProfileImageUrls: string[];
    commentCount: number;
}