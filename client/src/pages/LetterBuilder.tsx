import Sidebar from "../components/Sidebar";
import Suggestion from "../components/Suggestion";
import useApi from "../hooks/useApi";
import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { useTranslation } from "react-i18next";

const LetterBuilder = () => {
  const { fetchData } = useApi();
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [recipientName, setRecipientName] = useState(t("recipient1"));
  const [sender, setSender] = useState("");
  const [customRecipient, setCustomRecipient] = useState("");
  const suggestions = [t("suggestion1"), t("suggestion2"), t("suggestion3")];
  const firstName =
    JSON.parse(localStorage.getItem("user") || "{}").firstName || "";
  const lastName =
    JSON.parse(localStorage.getItem("user") || "{}").lastName || "";

  const recipientSuggestions = [
    t("recipient1"),
    t("recipient2"),
    t("recipient3"),
    t("other"),
  ];
  useEffect(() => {
    setSender(`${firstName} ${lastName}`);
  }, [firstName, lastName]);
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (!sender || !message) {
      alert(t("all-fields-required"));
      setLoading(false);
      return;
    }
    if (recipientName === t("other") && !customRecipient) {
      alert(t("all-fields-required"));
      setLoading(false);
      return;
    }
    try {
      const recipient =
        recipientName === t("other") ? customRecipient : recipientName;
      const response = (await fetchData("/tools/generate-letter", {
        method: "POST",
        body: JSON.stringify({
          sender: sender,
          details: message,
          recipient: recipient,
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
              {
                // it should consist of options recipientSuggestions
              }
              <select
                className="border-2 border-gray-300 p-2 rounded-lg"
                name="recipientName"
                id="recipientName"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
              >
                {recipientSuggestions.map((suggestion, index) => (
                  <option
                    key={index}
                    value={suggestion}
                    className="text-[black]"
                  >
                    {suggestion}
                  </option>
                ))}
              </select>
              {recipientName === t("other") && (
                <input
                  type="text"
                  name="otherRecipient"
                  className="border-2 border-gray-300 p-2 rounded-lg mt-2"
                  placeholder={t("recipient-name")}
                  value={customRecipient}
                  onChange={(e) => setCustomRecipient(e.target.value)}
                />
              )}
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
