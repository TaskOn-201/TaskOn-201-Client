import InboxContent from "./InboxContent";
import { Message } from "./type";

// 서버에서 메시지 데이터를 가져오는 함수
async function getMessages(): Promise<Message[]> {
  //실제 API 호출로 대체
  return [
    {
      id: 1,
      sender: "짱구",
      avatar: "JG",
      subject: "ㅎㅇ",
      preview: "ㅎㅇㅇ",
      time: "3 minutes ago",
      isRead: false,
      participants: [
        { id: 1, name: "짱구", avatar: "JG" },
        { id: 2, name: "철수", avatar: "CS" },
      ],
    },
    {
      id: 2,
      sender: "철수",
      avatar: "CS",
      subject: "ㅎㅇ",
      preview: "ㅎㅇㅇ",
      time: "1 hour ago",
      isRead: false,
      participants: [
        { id: 2, name: "철수", avatar: "CS" },
        { id: 4, name: "훈이", avatar: "HN" },
      ],
    },
    {
      id: 3,
      sender: "유리",
      avatar: "YL",
      subject: "ㅎㅇ",
      preview: "ㅎㅇㅇ",
      time: "4 hours ago",
      isRead: false,
      participants: [
        { id: 3, name: "유리", avatar: "YL" },
        { id: 5, name: "맹구", avatar: "MG" },
      ],
    },
    {
      id: 4,
      sender: "훈이",
      avatar: "HN",
      subject: "ㅎㅇ",
      preview: "ㅎㅇㅇ",
      time: "6 hours ago",
      isRead: true,
      participants: [
        { id: 4, name: "훈이", avatar: "HN" },
        { id: 1, name: "짱구", avatar: "JG" },
      ],
    },
    {
      id: 5,
      sender: "맹구",
      avatar: "MG",
      subject: "ㅎㅇ",
      preview: "ㅎㅇㅇ",
      time: "1 hours ago",
      isRead: true,
      participants: [
        { id: 4, name: "훈이", avatar: "HN" },
        { id: 5, name: "맹구", avatar: "MG" },
      ],
    },
  ];
}

export default async function InboxPage() {
  // 서버에서 데이터 페칭
  const messages = await getMessages();

  return <InboxContent initialMessages={messages} />;
}
