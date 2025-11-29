import { LabelName } from "@/app/board/type";
import { LabelVariant } from "@/components/Label";
import { SelectOption } from "@/components/task/TaskPopoverSelect";

export const LABEL_OPTIONS: ReadonlyArray<SelectOption<LabelName>> = [
    { value: "HIGH", label: "HIGH", variant: "red" as LabelVariant },
    { value: "MEDIUM", label: "MEDIUM", variant: "yellow" as LabelVariant },
    { value: "LOW", label: "LOW", variant: "default" as LabelVariant },
]
