"use client";

import { useState } from "react";
import Button from "@/components/Button";
import InboxSidebar from "./InboxSidebar";
import MessageDetail from "./MessageDetail";
import PageHeader from "@/components/PageHeader";
import { Message } from "./type";

interface InboxContentProps {
  initialMessages: Message[];
}

export default function InboxContent({ initialMessages }: InboxContentProps) {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(
    initialMessages[0]
  );
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [replyText, setReplyText] = useState("");

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    // 메시지를 읽음으로 표시
    setMessages(
      messages.map((msg) =>
        msg.id === message.id ? { ...msg, isRead: true } : msg
      )
    );
  };

  const handleSendReply = () => {
    if (replyText.trim()) {
      console.log("Sending reply:", replyText);
      setReplyText("");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <PageHeader
        left="Inbox"
        className="px-6 py-6 border-b border-gray2"
        right={
          <Button
            label="+ 채팅 생성"
            variant="primary"
            size="sm"
            className="px-4 py-2 rounded-2xl"
          />
        }
      />
      <div className="flex-1 flex">
        <InboxSidebar
          messages={messages}
          selectedMessageId={selectedMessage?.id || null}
          onMessageClick={handleMessageClick}
        />

        {selectedMessage ? (
          <MessageDetail
            message={selectedMessage}
            replyText={replyText}
            onReplyChange={setReplyText}
            onSendReply={handleSendReply}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray3">
            <p>메시지를 선택해주세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
