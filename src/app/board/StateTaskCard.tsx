import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Label from "@/components/Label";
import Profile from "@/components/Profile";
import { MessageSquareText, Plus } from "lucide-react";
import { Priority, StateDataProps } from "./type";

type color = "red" | "green" | "default";

const PRIORITY_VARIANT_MAP: Record<Priority, color> = {
    HIGH: "red",
    MEDIUM: "green",
    LOW: "default",
};

const StateTaskCard = ({
    title,
    priority,
    assigneeProfileImageUrl,
    participantProfileImageUrls,
    commentCount,
}: StateDataProps) => {
    return (
        <li className="cursor-pointer">
            <Card className="px-0 py-4 gap-10">
                <CardContent>
                    <h4 className="mb-3 whitespace-nowrap overflow-hidden text-ellipsis">
                        {title}
                    </h4>
                    <Label
                        label={priority}
                        variant={PRIORITY_VARIANT_MAP[priority]}
                        size="sm"
                    />
                </CardContent>
                <CardFooter className="flex justify-between text-gray3">
                    <div className="flex items-center">
                        <MessageSquareText size={18} className="mr-1.5" />
                        <p>{commentCount}</p>
                    </div>
                    <div className="flex-row-reverse relative translate-x-6 hidden xl:flex">
                        {assigneeProfileImageUrl && (
                            <Profile
                                imageUrl={assigneeProfileImageUrl}
                                className="size-10 border-4 border-white -translate-x-4"
                            />
                        )}
                        {participantProfileImageUrls.length >= 1 && (
                            <Profile
                                imageUrl={participantProfileImageUrls[0]}
                                className="size-10 border-4 border-white -translate-x-2"
                            />
                        )}
                        {participantProfileImageUrls.length >= 2 && (
                            <Profile
                                imageUrl={participantProfileImageUrls[1]}
                                className="size-10 border-4 border-white"
                            />
                        )}
                        {participantProfileImageUrls.length > 2 ? (
                            <Plus size={14} className="translate-x-26" />
                        ) : (
                            <></>
                        )}
                    </div>
                </CardFooter>
            </Card>
        </li>
    );
};

export default StateTaskCard;
