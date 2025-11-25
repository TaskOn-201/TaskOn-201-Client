import StateTaskCard from "./StateTaskCard";
import { StateDataProps } from "./type";

interface StateSectionProps {
    state: string;
    tasks: StateDataProps[];
}

const StateSection = ({ state, tasks }: StateSectionProps) => {
    return (
        <section className="flex-1 min-w-[200px]">
            <h3 className="mb-3 ml-1 text-xl text-gray5 font-bold">{state}</h3>
            <ul className="bg-gray1/80 p-4 rounded-xl flex flex-col gap-3">
                {tasks.map((item) => (
                    <StateTaskCard key={item.taskId} {...item} />
                ))}
            </ul>
            <button className="w-full mt-6 text-center text-gray3 cursor-pointer">
                + task 생성
            </button>
        </section>
    );
};

export default StateSection;
