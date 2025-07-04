import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import useApi from "../hooks/useApi";
import ReactMarkdown from "react-markdown";
import { useMemberstackReady } from "../context/MemberstackProvider";
import { LoaderCircle } from "lucide-react";

interface ChatMessage {
  from: "user" | "bot";
  text: string;
}

interface Response {
  messages: ChatMessage[];
}

const AdvisorChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { fetchData } = useApi();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isMemberstackReady = useMemberstackReady();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  console.log(messages);
  useEffect(() => {
    if (!isMemberstackReady) return;

    const fetchInitMessages = async () => {
      try {
        const response = (await fetchData(
          "/chat/advisor-messages"
        )) as Response;
        setMessages(response.messages);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitMessages();
  }, [isMemberstackReady]);

  const handleSendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || loading) return;

    setLoading(true);
    setMessages((prev) => [...prev, { from: "user", text: trimmedText }]);
    setInputText("");

    try {
      const response = await fetchData("/tools/chat-advisor", {
        method: "POST",
        body: JSON.stringify({ message: trimmedText, feature: "chat" }),
        headers: { "Content-Type": "application/json" },
      });

      setMessages((prev) => [...prev, { from: "bot", text: response.reply }]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 sm:p-10 md:p-14 lg:p-16 gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Advisor Chat</h1>

        <div className="flex flex-1 flex-col border rounded-lg overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {initialLoading ? (
              <div className="flex justify-center items-center">
                <LoaderCircle />
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-md w-fit max-w-[80%] ${
                      msg.from === "user"
                        ? "bg-navbar self-end text-white"
                        : "bg-[#cdcdcd] self-start"
                    }`}
                  >
                    {msg.text.replace(/<br\s*\/?>/gi, "\n")}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 p-2 rounded-md"
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage(inputText);
                }
              }}
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

export default AdvisorChat;
