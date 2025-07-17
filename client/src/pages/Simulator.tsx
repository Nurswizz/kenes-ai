import Sidebar from "../components/Sidebar";
import { PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import useApi from "../hooks/useApi";
import { useMemberstackReady } from "../context/MemberstackProvider";

const ChatContainer = ({ title, id }: { title: string; id: string }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/tools/simulator/${id}`);
  };
  return (
    <button
      className="text-left px-2 py-2 hover:bg-[#cdcdcd] rounded-lg transition-colors text-2xl font-bold"
      onClick={handleClick}
    >
      {title}
    </button>
  );
};

const Simulator = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [error, setError] = useState("");

  const { fetchData } = useApi();
  const isMemberstackReady = useMemberstackReady();

  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    if (!isMemberstackReady) {
      return;
    }
    const fetchChats = async () => {
      try {
        const response = await fetchData("/chat/simulator-chats") as unknown as any;
        setChats(response.chats || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };
    fetchChats();
  }, [isMemberstackReady]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleCreate = async () => {
    console.log("Creating simulation with subject:", subject);
    if (subject === "Другое" && customSubject.trim() === "") {
      setError("Пожалуйста, введите тему для 'Другое'.");
      return;
    }

    if (subject === "") {
      setError("Пожалуйста, выберите тему.");
      return;
    }

    const scenario = subject === "Другое" ? customSubject : subject;

    try {
      const response = await fetchData("/chat/simulator-chats", {
        method: "POST",
        body: JSON.stringify({ scenario }),
      }) as unknown as any;
      console.log("Chat created:", response);
      setChats((prevChats) => [...prevChats, response.chat]);
    } catch (error) {
      console.error("Error creating chat:", error);
    }

    setSubject("");
    setCustomSubject("");
    setError("");
    handleModalClose();
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 sm:p-10 md:p-14 lg:p-16 gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Simulator Chats</h1>
        <div className="flex-1 flex flex-col gap-2">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <ChatContainer key={chat._id} title={chat.scenario} id={chat._id} />
            ))
          ) : (
            <p className="text-gray-500">
              No chats available. Create a new one!
            </p>
          )}
        </div>
        <button
          onClick={handleModalOpen}
          className="flex items-center gap-2 hover:bg-[#cdcdcd] p-2 rounded-lg transition-colors max-lg:mb-[50px]"
        >
          <PlusCircle className="w-6 h-6 text-primary cursor-pointer" />
          <span className="text-lg font-semibold">Create New Simulation</span>
        </button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-[#000000] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">New Simulation</h2>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded mb-4"
              >
                <option value="" disabled>
                  Выберите тему
                </option>
                <option value="Запрос Субсидии">Запрос Субсидии</option>
                <option value="Подача жалобы в акимат">
                  Подача жалобы в акимат
                </option>
                <option value="Получение разрешения/лицензии">
                  Получение разрешения/лицензии
                </option>
                <option value="Переговоры о бюджетном финансировании">
                  Переговоры о бюджетном финансировании
                </option>
                <option value="Другое">Другое</option>
              </select>
              {subject === "Другое" && (
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Введите тему"
                  className="w-full border border-gray-300 p-2 rounded mb-4"
                />
              )}

              {error && <p className="text-[red] text-sm mb-4">{error}</p>}

              <div className="flex justify-end gap-2">
                <button
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Simulator;
