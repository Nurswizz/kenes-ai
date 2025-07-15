import { useParams } from "react-router";
import Sidebar from "../components/Sidebar";
import { useEffect, useRef, useState } from "react";
import useApi from "../hooks/useApi";
import { LoaderCircle } from "lucide-react";
import { useMemberstackReady } from "../context/MemberstackProvider";

interface IChatMessage {
  _id?: object;
  from: "system" | "user" | "bot";
  text: string;
  chatId?: string;
  chatType?: "advisor" | "simulator";
  createdAt?: Date;
  meta?: Record<string, any>;
}

const SimulatorChat = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchData } = useApi();
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isMemberstackReady = useMemberstackReady();
  const [scenario, setScenario] = useState<string>("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    if (!id || !isMemberstackReady) return;

    const userMsg: IChatMessage = {
      from: "user",
      text,
      chatId: id,
      chatType: "simulator",
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setLoading(true);

    try {
      const response = (await fetchData(`/tools/simulator-chat/${id}`, {
        method: "POST",
        body: JSON.stringify({ message: text, feature: "chat" }),
      })) as { result: IChatMessage };

      if (response) {
        setMessages((prev) => [...prev, response.result]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id || !isMemberstackReady) return;

    const getChatInfo = async () => {
      try {
        const response = (await fetchData(`/chat/simulator-chats/${id}`)) as {
          chat: { scenario: string };
        };
        if (!response.chat) {
          console.error("Chat not found");
          return;
        }
        setScenario(response.chat.scenario || "");
      } catch (error) {
        console.error("Error fetching chat info:", error);
      }
    };

    const fetchMessages = async () => {
      try {
        setInitialLoading(true);
        const response = (await fetchData(
          `/chat/simulator-messages/${id}`
        )) as { messages: IChatMessage[] };
        setMessages(response.messages || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    getChatInfo();
    fetchMessages();
  }, [id, isMemberstackReady]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 sm:p-10 md:p-14 lg:p-16 gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold">{scenario}</h1>

        <div className="flex flex-1 flex-col border rounded-lg overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {initialLoading ? (
              <div className="flex justify-center items-center">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : (
              <>
                {messages.length > 0 ? (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-md w-fit max-w-[80%] ${
                        msg.from === "user"
                          ? "bg-navbar self-end text-white"
                          : "bg-[#cdcdcd] self-start"
                      }`}
                    >
                      <div
                        className={`prose max-w-none text-sm text-[#000000]`}
                      >
                        {msg.text}
                      </div>
                      <div></div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-md w-fit max-w-[80%] bg-[#cdcdcd] self-start italic opacity-70">
                    No messages yet. Start the conversation!
                  </div>
                )}
                {loading && (
                  <div className="p-3 rounded-md w-fit max-w-[80%] bg-[#cdcdcd] self-start italic opacity-70">
                    Bot is typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              placeholder="Введите сообщение..."
              className="flex-1 border border-gray-300 p-2 rounded-md"
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }
              }}
              disabled={loading}
            />
            <button
              className="bg-navbar text-white px-4 py-2 rounded-md"
              onClick={() => handleSendMessage(inputText)}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorChat;
