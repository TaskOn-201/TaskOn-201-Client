import { Minus } from "lucide-react";
import Button from "../Button";
import Label from "../Label";
import { Participant } from "../participant/type";
import PopoverActionItem from "../popover/PopoverActionItem";
import PopoverDropbox from "../popover/PopoverDropbox";
import { PopoverDropboxOption } from "../popover/type";
import Profile from "../Profile";

interface TaskParticipantSelectProps {
    participants: Participant[];
    selectedUserIds: number[];
    onChange: (ids: number[]) => void;
    placeholder?: string;
}

const TaskParticipantSelect = ({
    participants,
    selectedUserIds,
    onChange,
    placeholder = " + 참여자 선택",
}: TaskParticipantSelectProps) => {
    // 선택된 참여자
    const selected = participants.filter((participant) =>
        selectedUserIds.includes(participant.userId)
    );

    // 선택되지 않은 참여자
    const available = participants.filter(
        (participant) => !selectedUserIds.includes(participant.userId)
    );

    // 아직 남은 참여자가 있는지 여부
    const selectMore = available.length > 0;

    const selectHandler = (userId: number) => {
        onChange([...selectedUserIds, userId]);
    };

    const removeHandler = (userId: number) => {
        onChange(selectedUserIds.filter((id) => id !== userId));
    };

    const options: PopoverDropboxOption[] = available.map((p) => ({
        value: String(p.userId),
        label: p.name,
        leftIcon: p.profileImageUrl && (
            <Profile className="size-4" imageUrl={p.profileImageUrl} />
        ),
        onClick: () => selectHandler(p.userId),
    }));

    const SelectedLabels = (
        <div className="flex flex-wrap gap-1">
            {selected.map((p) => (
                <Label
                    key={p.userId}
                    text={p.name}
                    size="sm"
                    leftIcon={
                        p.profileImageUrl && (
                            <Profile
                                className="size-4"
                                imageUrl={p.profileImageUrl}
                            />
                        )
                    }
                    rightIcon={
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeHandler(p.userId);
                            }}
                            className="absolute -top-1 rounded-ful p-1"
                            variant="disable"
                            icon={
                                <Minus
                                    size={5}
                                    strokeWidth={4}
                                />
                            }
                        />
                    }
                    variant="white"
                    className="relative"
                />
            ))}
        </div>
    );

    if (!selectMore) {
        return SelectedLabels;
    }

    return (
        <PopoverActionItem
            trigger={
                <div className="flex flex-wrap gap-1">
                    {SelectedLabels.props.children}
                    <Button
                        size="sm"
                        variant="white"
                        label={placeholder}
                        className="text-[12px] py-1.5 text-gray3"
                    />
                </div>
            }
            content={(close) => (
                <PopoverDropbox
                    options={options.map((option) => ({
                        ...option,
                        variant: "white",
                        onClick: () => {
                            option.onClick?.();
                            close();
                        },
                    }))}
                />
            )}
        />
    );
};

export default TaskParticipantSelect;
