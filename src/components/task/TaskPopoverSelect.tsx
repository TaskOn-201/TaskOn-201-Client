"use client"

import Button from "../Button";
import Label, { LabelVariant } from "../Label";
import PopoverActionItem from "../popover/PopoverActionItem";
import PopoverDropbox from "../popover/PopoverDropbox";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  variant? : LabelVariant;
  onClick?: () => void;
};

interface TaskPopoverSelectProp<T extends string> {
    value?: T; // value 값이 확실하게 string 값이도록
    placeholder: string;
    onChange: (value: T) => void;
    options: ReadonlyArray<SelectOption<T>>;
    variant?: LabelVariant;
}

const TaskPopoverSelect = <T extends string>({
    value,
    placeholder,
    onChange,
    options,
    variant,
}: TaskPopoverSelectProp<T>) => {
    const selected = value
        ? options.find((option) => option.value === value)
        : undefined;

    return (
        <PopoverActionItem
            trigger={
                selected ? (
                    <Label
                        text={selected.label}
                        size="sm"
                        variant={selected.variant || variant}
                    />
                ) : (
                    <Button
                        size="sm"
                        variant="white"
                        label={placeholder}
                        className="text-[12px] py-1.5 text-gray3"
                    />
                )
            }
            content={(close) => (
                <PopoverDropbox
                    options={options.map((option) => ({
                        value: option.value,
                        label: option.label,
                        variant: option.variant,
                        onClick: () => {
                            onChange(option.value);
                            close();
                        },
                    }))}
                />
            )}
        ></PopoverActionItem>
    );
};

export default TaskPopoverSelect;
