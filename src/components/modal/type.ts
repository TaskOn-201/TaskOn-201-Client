export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}

export interface ProjectTeamModalTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  footer?: React.ReactNode;
}

export interface ProjectTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tabs: ProjectTeamModalTab[];
  defaultTabId?: string;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  className?: string;
}
export interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showCloseButton?: boolean;
  className?: string;
}
