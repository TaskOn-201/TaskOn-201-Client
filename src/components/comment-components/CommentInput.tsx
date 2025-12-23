"use client"

import Profile from "../Profile";
import Button from "../Button";
import { Send } from "lucide-react";
import { MeUser } from "@/lib/auth/authStorage";

interface CommentInputProps {
    me: MeUser;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled: boolean;
}

const CommentInput = ({
    me,
    value,
    onChange,
    onSubmit,
    disabled,
}: CommentInputProps) => {
    if (!me) return;

    return (
        <div className="py-4 grid grid-cols-[40px_1fr_50px] gap-x-4 items-start">
            <Profile size="sm" imageUrl={me?.profileImageUrl ?? ""} />
            <textarea
                id="commentInput"
                name="commentInput"
                value={value}
                placeholder="comment 내용을 작성해주세요"
                onChange={(e) => onChange(e.target.value)}
                className="w-full border rounded-md px-3 py-2.5 text-sm resize-none overflow-auto min-h-11"
                required
            />
            <Button
                icon={<Send size={20} color="white" />}
                onClick={onSubmit}
                className="h-full bg-black/70 hover:bg-black/80"
                disabled={disabled}
            />
        </div>
    );
};

export default CommentInput;
