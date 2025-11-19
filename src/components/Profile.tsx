import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileProps {
  imageUrl?: string;
  userName?: string;
  fallbackText?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Profile({
  imageUrl,
  userName,
  fallbackText,
  size = "md",
  className,
}: ProfileProps) {
  const sizeClasses = {
    sm: "size-8",
    md: "size-12",
    lg: "size-16",
  };

  // 사용자 이름에서 이니셜 자동 생성
  const getInitials = (name?: string) => {
    if (fallbackText) return fallbackText;
    if (!name) return "U";

    const names = name.trim().split(" ");
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <div className={className}>
      <Avatar className={sizeClasses[size]}>
        {imageUrl && <AvatarImage src={imageUrl} alt={userName || "User"} />}
        <AvatarFallback>{getInitials(userName)}</AvatarFallback>
      </Avatar>
    </div>
  );
}
