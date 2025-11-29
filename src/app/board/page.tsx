"use client";

import Button from "@/components/Button";
import Input from "@/components/Input";
import PageHeader from "@/components/PageHeader";
import VerticalDropbox from "@/components/VerticalDropbox";
import StateSection from "./StateSection";
import { StateDataProps } from "./type";
import { useState } from "react";
import TaskCreateModal from "@/components/task/TaskEditorModal";

const options = [
    {
        label: "제목",
        value: "title",
    },
    {
        label: "중요도",
        value: "priority",
    },
    {
        label: "사용자명",
        value: "name",
    },
];

type BoardData = {
    todo: StateDataProps[];
    inProgress: StateDataProps[];
    completed: StateDataProps[];
};

const data: BoardData = {
    todo: [
        {
            taskId: 10,
            title: "로그인 페이지 UI",
            label: {
                labelName: "HIGH",
                color: "RED",
            },
            assigneeProfileImageUrl: "https://...",
            participantProfileImageUrls: [
                "https://...",
                "https://...",
                "https://...",
            ],
            commentCount: 3,
        },
        {
            taskId: 11,
            title: "로그인 페이지 UI",
            label: {
                labelName: "HIGH",
                color: "RED",
            },
            assigneeProfileImageUrl: "https://...",
            participantProfileImageUrls: [],
            commentCount: 3,
        },
    ],
    inProgress: [
        {
            taskId: 8,
            title: "로그인 페이지 UI",
            label: {
                labelName: "LOW",
                color: "GRAY",
            },
            assigneeProfileImageUrl: "https://...",
            participantProfileImageUrls: ["https://..."],
            commentCount: 3,
        },
    ],

    completed: [
        {
            taskId: 4,
            title: "로그인 페이지 UI",
            label: {
                labelName: "MEDIUM",
                color: "YELLOW",
            },
            assigneeProfileImageUrl: "https://...",
            participantProfileImageUrls: ["https://..."],
            commentCount: 3,
        },
    ],
};

const Board = () => {
    const [isTaskEditorModalOpen, setIsTaskEditorModalOpen] = useState(false);

    return (
        <>
            <main>
                <PageHeader
                    className="px-14"
                    left="Board"
                    center={
                        <div className="flex items-center">
                            <VerticalDropbox
                                options={options}
                                className="mr-2 py-4.5 size-26"
                            />
                            <Input search />
                        </div>
                    }
                    right={
                        <Button
                            label="+ task 생성"
                            size="sm"
                            className="font-bold px-4"
                            onClick={() => setIsTaskEditorModalOpen(true)}
                        />
                    }
                />
                <div className="w-full mx-auto px-20 pt-4 flex gap-8 xl:gap-16 justify-between">
                    <StateSection status="To do" tasks={data.todo} />
                    <StateSection status="In Progress" tasks={data.inProgress} />
                    <StateSection status="Completed" tasks={data.completed} />
                </div>
            </main>
            <TaskCreateModal
                isOpen={isTaskEditorModalOpen}
                onClose={() => setIsTaskEditorModalOpen(false)}
            />
        </>
    );
};

export default Board;
