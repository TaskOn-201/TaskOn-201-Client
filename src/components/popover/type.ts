import { LabelVariant } from "../Label";

export interface PopoverDropboxOption {
    value: string;
    label: string;
    variant?: LabelVariant;
    leftIcon?: React.ReactNode;
    onClick?: () => void;
}
