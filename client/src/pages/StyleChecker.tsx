import useApi from "../hooks/useApi";

import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

const StyleChecker = () => {
  const { fetchData } = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.stopPropagation();
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const text = formData.get("text") as string;

    try {
      const response = await fetchData("/tools/style-check", {
        method: "POST",
        body: JSON.stringify({ message: text, feature: "style" }),
      });
      if (response.status == 403) {
        setError("You have no style check trials left. Please upgrade to Pro.");
      }
      alert("Style check completed successfully!");
      console.log(response);
    } catch (error) {
      console.error("Error checking style:", error);
      if (error instanceof Error) {
        setError(error.message);

      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div>
        <div className="flex-1 flex flex-col p-6 sm:p-10 md:p-14 lg:p-16 gap-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Style Checker</h1>
          <p className="text-lg">
            Use our Style Checker to analyze your text for grammar, style, and
            clarity.
          </p>
          <form className="w-full max-w-2xl" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <textarea
                name="text"
                className="border-2 border-gray-300 p-2 rounded-lg h-40 resize-none"
                placeholder="Enter your text here"
              ></textarea>
              <button
                type="submit"
                className="bg-navbar p-2 rounded-lg hover:bg-[#a4bcff] transition-colors w-fit font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <LoaderCircle className="animate-spin h-5 w-5 text-white" />
                ) : (
                  "Check Style"
                )}
              </button>
              {error && (
                <div className="text-red-500 mt-2">
                  Error: {error}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StyleChecker;
