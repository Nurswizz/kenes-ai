import Sidebar from "../components/Sidebar";
import useApi from "../hooks/useApi";
const LetterBuilder = () => {
  const { fetchData } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const recipientName = formData.get("recipientName") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    try {
      await fetchData("/tools/letter-builder", {
        method: "POST",
        body: JSON.stringify({ recipientName, subject, message }),
      });
      alert("Letter sent successfully to your email!");
    } catch (error) {
      console.error("Error sending letter:", error);
      alert("Failed to send letter. Please try again.");
    }
  };

  return (
    <div className="flex h-full lg:h-screen flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 sm:p-10 md:p-14 lg:p-16 gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Letter Builder</h1>
        <form onSubmit={(e) => e.preventDefault()} className="w-full max-w-2xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                className="border-2 border-gray-300 p-2 rounded-lg"
                placeholder="Enter recipient name"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">Subject</label>
              <input
                type="text"
                className="border-2 border-gray-300 p-2 rounded-lg"
                placeholder="Enter subject"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-lg font-semibold mb-1">Message</label>
              <textarea
                className="border-2 border-gray-300 p-2 rounded-lg h-40 resize-none"
                placeholder="Write your message here"
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-navbar p-2 rounded-lg hover:bg-[#a4bcff] transition-colors w-fit font-semibold"
            >
              Send Letter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LetterBuilder;
