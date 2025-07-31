import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Suggestion from "../components/Suggestion";
import useApi from "../hooks/useApi";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ChatMessage {
  from: "user" | "bot";
  text: string;
}

interface Response {
  messages: ChatMessage[];
}

const suggestions = [ 
  "Что такое ИП",
  "Как зарегистрировать компанию",
  "Как подать налоговую декларацию",
];

const AdvisorChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { fetchData } = useApi();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);


  const { t } = useTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  function decodeHtmlEntities(text: string): string {
    const txt = document.createElement("textarea");
    txt.innerHTML = text;
    return txt.value;
  }

  function prepareMarkdown(text: string): string {
    let decoded = decodeHtmlEntities(text);

    decoded = decoded.replace(/<br\s*\/?>/gi, "  \n");

    const keywords = [
      "Юридическая оценка",
      "Применимое законодательство",
      "Практика",
      "Применение закона",
      "Источники",
      "Құқықтық бағалау",
      "Қолданылатын заңнама",
      "Тәжірибе", 
      "Заң қолдану", 
      "Дереккөздер"
    ];

    for (const word of keywords) {
      const regex = new RegExp(`(?<!\\*)(${word})(?!\\*)`, "g");
      decoded = decoded.replace(regex, "**$1**");
    }

    return decoded;
  }

  useEffect(() => {

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
        inputRef.current?.focus();
      }
    };

    fetchInitMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText || loading) return;

    setLoading(true);
    setMessages((prev) => [...prev, { from: "user", text: trimmedText }]);
    setInputText("");

    try {
      const response = (await fetchData("/tools/chat-advisor", {
        method: "POST",
        body: JSON.stringify({ message: trimmedText, feature: "chat" }),
        headers: { "Content-Type": "application/json" },
      })) as { reply: string };

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
        <h1 className="text-3xl sm:text-4xl font-bold">{t("advisor")}</h1>

        <div className="flex flex-1 flex-col border rounded-lg overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {initialLoading ? (
              <div className="flex justify-center items-center">
                <LoaderCircle className="animate-spin" />
              </div>
            ) : (
              <>
                {messages.length > 0 ? messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-md w-fit max-w-[80%] ${
                      msg.from === "user"
                        ? "bg-navbar self-end text-white"
                        : "bg-[#cdcdcd] self-start"
                    }`}
                  >
                    <div
                      className={`prose max-w-none text-sm ${
                        msg.from === "user" ? "text-white" : "text-black"
                      }`}
                    >
                      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                        {prepareMarkdown(msg.text)}
                      </ReactMarkdown>
                    </div>
                  </div>
                )) : (
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
          {
            inputText.length === 0 && (
              <div className="flex flex-wrap gap-2 p-4 bg-gray-100 border-t">
                {suggestions.map((suggestion, index) => (
                  <Suggestion
                    key={index}
                    suggestion={suggestion}
                    setValue={setInputText}
                  />
                ))}
              </div>
            )
          }
          {/* Input */}
          <div className="p-4 border-t flex items-center gap-2">
            <input
              ref={inputRef}
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
              {loading ? "..." : t("send")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvisorChat;
