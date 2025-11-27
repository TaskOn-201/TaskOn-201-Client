export interface Participant {
  id: number;
  name: string;
  avatar: string;
}

export interface Message {
  id: number;
  sender: string;
  avatar: string;
  subject: string;
  preview: string;

  time: string;
  isRead: boolean;
  participants: Participant[]; // 채팅 참여자 목록
}

export interface ThreadMessage {
  id: number;
  sender: string;
  avatar: string;
  content: string;
  time: string;
  isCurrentUser: boolean;
}
