import Sidebar from "../components/Sidebar";
import useApi from "../hooks/useApi";
import { useState } from "react";
import { Loader2Icon } from "lucide-react";

const LetterBuilder = () => {
  const { fetchData } = useApi();
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const recipientName = formData.get("recipientName") as string;
    const sender = formData.get("sender") as string;
    const message = formData.get("message") as string;

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
      console.log("Response from server:", response);
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
        <h1 className="text-3xl sm:text-4xl font-bold">Letter Builder</h1>
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                name="recipientName"
                className="border-2 border-gray-300 p-2 rounded-lg"
                placeholder="Enter recipient name"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">Sender</label>
              <input
                type="text"
                name="sender"
                className="border-2 border-gray-300 p-2 rounded-lg"
                placeholder="Enter your name"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">Details</label>
              <textarea
                name="message"
                className="border-2 border-gray-300 p-2 rounded-lg h-40 resize-none"
                placeholder="Write your message here"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-navbar p-2 rounded-lg hover:bg-[#a4bcff] transition-colors w-fit font-semibold"
            >
              {loading ? (
                <Loader2Icon className="animate-spin h-5 w-5 text-white" />
              ) : (
                "Generate Letter"
              )}
            </button>
            {link && (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Download Letter
              </a>
            )}
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default LetterBuilder;
