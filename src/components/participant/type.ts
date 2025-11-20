export type ParticipantListMode = "read" | "invite" | "delete";

export interface Participant {
    userId: number;
    name: string;
    email: string;
    profileImageUrl: string | null;
    role: string;
    removable: boolean;
    isExisting: boolean;
}