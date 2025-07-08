import Sidebar from "../components/Sidebar";
import { PlusCircle } from "lucide-react";

const ChatContainer = ({title, id}: {title: string, id:string}) => {
    const handleClick = () => {
        console.log(`Chat clicked: ${id}`);
    }
    return (
        <button className="text-left px-2 py-2 hover:bg-[#cdcdcd] rounded-lg transition-colors text-2xl font-bold" onClick={handleClick}>
            {title}
        </button>
    );
};


const Simulator = () => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col p-6 sm:p-10 md:p-14 lg:p-16 gap-6">
                <h1 className="text-3xl sm:text-4xl font-bold">Simulator Chats</h1>
                <div className="flex-1 flex flex-col gap-2">
                    <ChatContainer title="Запрос субсидии" id="1" />
                    <ChatContainer title="Запрос на кредит" id="2" />
                </div>
                {/* Add chat containers with PlusCircle icon */
                <button className="flex items-center gap-2 hover:bg-[#cdcdcd] p-2 rounded-lg transition-colors max-lg:mb-[50px]">
                    <PlusCircle className="w-6 h-6 text-primary cursor-pointer" />
                    <span className="text-lg font-semibold">Create New Simulation</span>
                </button>
                }
            </div>
        </div>
    )
}

export default Simulator;