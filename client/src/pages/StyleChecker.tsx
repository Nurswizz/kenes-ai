import useApi from "../hooks/useApi";

import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { XCircle } from "lucide-react";
import { CheckCircle } from "lucide-react";

interface IResponse {
  isFormal: boolean;
  isPolite: boolean;
  isConcise: boolean;
  hasCorrectGrammar: boolean;
  hasCorrectSpelling: boolean;
  hasCorrectPunctuation: boolean;
  hasClearStructure: boolean;
  isProfessionalLanguage: boolean;
  isRespectfulTone: boolean;
  refinedMessage: string;
}

interface IResult {
  result: IResponse;
}

const StyleChecker = () => {
  const { fetchData } = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<IResponse | null>(null);
  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.stopPropagation();
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const text = formData.get("text") as string;

    try {
      const response: IResult = await fetchData("/tools/style-check", {
        method: "POST",
        body: JSON.stringify({ message: text, feature: "style" }),
      });
      console.log(response.result);
      setResponse(response.result);
    } catch (err: unknown) {
      if (
        (err as any)?.message?.includes("403") ||
        (err as any)?.status === 403
      ) {
        setError("You have no trials for this feature, upgrade to Pro Plan");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occurred");
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
              {error && <div className="text-[red] mt-2">Error: {error}</div>}
              {/* Display results here if needed */}
              {response && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
                  <ul className="list-disc pl-5">
                    <li>Formal: {response.isFormal ? "Yes" : "No"} {response.isFormal ? <CheckCircle color="green" className="inline h-4 w-4 text-green-500" /> : <XCircle color="red" className="inline h-4 w-4 text-red-500" />}</li>
                    <li>Polite: {response.isPolite ? "Yes" : "No"} {response.isPolite ? <CheckCircle color="green" className="inline h-4 w-4 text-green-500" /> : <XCircle color="red" className="inline h-4 w-4 text-red-500" />}</li>
                    <li>Concise: {response.isConcise ? "Yes" : "No"} {response.isConcise ? <CheckCircle color="green" className="inline h-4 w-4 text-green-500" /> : <XCircle color="red" className="inline h-4 w-4 text-red-500" />}</li>
                    <li>Correct Grammar: {response.hasCorrectGrammar ? "Yes" : "No"} {response.hasCorrectGrammar ? <CheckCircle color="green" className="inline h-4 w-4 text-green-500" /> : <XCircle color="red" className="inline h-4 w-4 text-red-500" />}</li>
                    <li>Correct Spelling: {response.hasCorrectSpelling ? "Yes" : "No"} {response.hasCorrectSpelling ? <CheckCircle color="green" className="inline h-4 w-4 text-green-500" /> : <XCircle color="red" className="inline h-4 w-4 text-red-500" />}</li>
                    <li>Correct Punctuation: {response.hasCorrectPunctuation ? "Yes" : "No"} {response.hasCorrectPunctuation ? <CheckCircle color="green" className="inline h-4 w-4 text-green-500" /> : <XCircle color="red" className="inline h-4 w-4 text-red-500" />}</li>
                    <li>Clear Structure: {response.hasClearStructure ? "Yes" : "No"} {response.hasClearStructure ? <CheckCircle color="green" className="inline h-4 w-4 text-green-500" /> : <XCircle color="red" className="inline h-4 w-4 text-red-500" />}</li>
                    <li>Professional Language: {response.isProfessionalLanguage ? "Yes" : "No"} {response.isProfessionalLanguage ? <CheckCircle color="green" className="inline h-4 w-4 text-green-500" /> : <XCircle color="red" className="inline h-4 w-4 text-red-500" />}</li>
                    <li>Respectful Tone: {response.isRespectfulTone ? "Yes" : "No"} {response.isRespectfulTone ? <CheckCircle color="green" className="inline h-4 w-4 text-green-500" /> : <XCircle color="red" className="inline h-4 w-4 text-red-500" />}</li>
                  </ul>
                  {response.refinedMessage && (
                    <div className="mt-4">
                      <h3 className="font-semibold">Refined Message:</h3>
                      <p>{response.refinedMessage}</p>
                    </div>
                  )}
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
