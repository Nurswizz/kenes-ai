import Sidebar from "../components/Sidebar";
import Suggestion from "../components/Suggestion";
import useApi from "../hooks/useApi";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

const suggestions = [
  "Задержка доставки заказа",
  "Подтверждение стажировки нужно",
  "Просьба об отсрочке",
  "Запрос на изменение условий контракта",
]

const LetterBuilder = () => {
  const { fetchData } = useApi();
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [sender, setSender] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (!recipientName || !sender || !message) {
      alert(t("all-fields-required"));
      setLoading(false);
      return;
    }

    try {
      const response = (await fetchData("/tools/generate-letter", {
        method: "POST",
        body: JSON.stringify({
          sender: sender,
          details: message,
          recipient: recipientName,
          feature: "letter",
        }),
      })) as any;
      const data = response.pdf;
      const pdfUrl = data.pdf_url;

      if (!pdfUrl) {
        alert("PDF URL not found.");
        return;
      }

      setLink(pdfUrl);
    } catch (error) {
      console.error("Error sending letter:", error);
      alert("Failed to send letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full lg:h-screen flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 sm:p-10 md:p-14 lg:p-16 gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold">
          {t("letter-builder")}
        </h1>
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">
                {t("recipient-name")}
              </label>
              <input
                type="text"
                name="recipientName"
                className="border-2 border-gray-300 p-2 rounded-lg"
                placeholder={t("recipient-name")}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">
                {t("sender")}
              </label>
              <input
                type="text"
                name="sender"
                className="border-2 border-gray-300 p-2 rounded-lg"
                placeholder={t("sender")}
                value={sender}
                onChange={(e) => setSender(e.target.value)}
              />
            </div>

            <div className="flex flex-col relative">
              <div className="relative">
                <label htmlFor="message" className="text-lg font-semibold mb-1">
                  {t("details")}
                </label>
                <textarea
                  name="message"
                  className="border-2 border-gray-300 p-2 rounded-lg h-72 resize-none w-full"
                  placeholder={t("details")}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                {/* Suggestion Box */}
                {message.length === 0 && (
                  <div className="absolute bottom-4 left-0 w-full flex justify-center gap-1 px-2 max-md:flex-wrap">
                    {suggestions.map((suggestion, index) => (
                      <Suggestion
                        key={index}
                        suggestion={suggestion}
                        setValue={setMessage}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="bg-navbar p-2 rounded-lg hover:bg-[#a4bcff] transition-colors w-fit font-semibold"
            >
              {loading ? (
                <Loader2Icon className="animate-spin h-5 w-5 text-white" />
              ) : (
                t("generate-letter")
              )}
            </button>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {t("download-letter")}
              </a>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default LetterBuilder;
