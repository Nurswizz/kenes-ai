import useApi from "../hooks/useApi";

import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { XCircle } from "lucide-react";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import Upsell from "../components/Upsell";
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
interface AccessResponse {
  canAccess: boolean;
  status: number;
}
const StyleChecker = () => {
  const { fetchData } = useApi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<IResponse | null>(null);
  const [canAccessStyle, setCanAccessStyle] = useState(true);
  const { t } = useTranslation();
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
  useEffect(() => {
    const checkFeatureAccess = async () => {
      const response = (await fetchData("/user/can-access-feature", {
        method: "POST",
        body: JSON.stringify({ featureKey: "style" }),
        headers: { "Content-Type": "application/json" },
      })) as AccessResponse;
      console.log(response);
      setCanAccessStyle(response.canAccess);
    };

    checkFeatureAccess();
  }, []);
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 sm:p-10 md:p-14 lg:p-16 gap-6">
        <div className="flex-1 flex flex-col gap-6">
          <h1 className="text-3xl sm:text-4xl font-bold">
            {t("feature.style")}
          </h1>
          <p className="text-lg">{t("style.header")}</p>
          <form className="w-full max-w-2xl" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <textarea
                name="text"
                className="border-2 border-gray-300 p-2 rounded-lg h-40 resize-none"
                placeholder={t("style.placeholder")}
              >
              </textarea>
              {canAccessStyle ? null : <Upsell />}
              <button
                type="submit"
                className="bg-navbar p-2 rounded-lg hover:bg-[#a4bcff] transition-colors w-fit font-semibold"
                disabled={loading || !canAccessStyle}
              >
                {loading ? (
                  <LoaderCircle className="animate-spin h-5 w-5 text-white" />
                ) : (
                  t("style")
                )}
              </button>
              {error && <div className="text-[red] mt-2">Error: {error}</div>}
              {/* Display results here if needed */}
              {response && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">
                    {t("style.analysis")}
                  </h2>
                  <ul className="list-disc pl-5">
                    <li>
                      {t("formal")}: {response.isFormal ? "Yes" : "No"}{" "}
                      {response.isFormal ? (
                        <CheckCircle
                          color="green"
                          className="inline h-4 w-4 text-green-500"
                        />
                      ) : (
                        <XCircle
                          color="red"
                          className="inline h-4 w-4 text-red-500"
                        />
                      )}
                    </li>
                    <li>
                      {t("polite")}: {response.isPolite ? "Yes" : "No"}{" "}
                      {response.isPolite ? (
                        <CheckCircle
                          color="green"
                          className="inline h-4 w-4 text-green-500"
                        />
                      ) : (
                        <XCircle
                          color="red"
                          className="inline h-4 w-4 text-red-500"
                        />
                      )}
                    </li>
                    <li>
                      {t("concise")}: {response.isConcise ? "Yes" : "No"}{" "}
                      {response.isConcise ? (
                        <CheckCircle
                          color="green"
                          className="inline h-4 w-4 text-green-500"
                        />
                      ) : (
                        <XCircle
                          color="red"
                          className="inline h-4 w-4 text-red-500"
                        />
                      )}
                    </li>
                    <li>
                      {t("grammatical")}:{" "}
                      {response.hasCorrectGrammar ? "Yes" : "No"}{" "}
                      {response.hasCorrectGrammar ? (
                        <CheckCircle
                          color="green"
                          className="inline h-4 w-4 text-green-500"
                        />
                      ) : (
                        <XCircle
                          color="red"
                          className="inline h-4 w-4 text-red-500"
                        />
                      )}
                    </li>
                    <li>
                      {t("spelling")}:{" "}
                      {response.hasCorrectSpelling ? "Yes" : "No"}{" "}
                      {response.hasCorrectSpelling ? (
                        <CheckCircle
                          color="green"
                          className="inline h-4 w-4 text-green-500"
                        />
                      ) : (
                        <XCircle
                          color="red"
                          className="inline h-4 w-4 text-red-500"
                        />
                      )}
                    </li>
                    <li>
                      {t("punctuation")}:{" "}
                      {response.hasCorrectPunctuation ? "Yes" : "No"}{" "}
                      {response.hasCorrectPunctuation ? (
                        <CheckCircle
                          color="green"
                          className="inline h-4 w-4 text-green-500"
                        />
                      ) : (
                        <XCircle
                          color="red"
                          className="inline h-4 w-4 text-red-500"
                        />
                      )}
                    </li>
                    <li>
                      {t("structure")}:{" "}
                      {response.hasClearStructure ? "Yes" : "No"}{" "}
                      {response.hasClearStructure ? (
                        <CheckCircle
                          color="green"
                          className="inline h-4 w-4 text-green-500"
                        />
                      ) : (
                        <XCircle
                          color="red"
                          className="inline h-4 w-4 text-red-500"
                        />
                      )}
                    </li>
                    <li>
                      {t("proffessional")}:{" "}
                      {response.isProfessionalLanguage ? "Yes" : "No"}{" "}
                      {response.isProfessionalLanguage ? (
                        <CheckCircle
                          color="green"
                          className="inline h-4 w-4 text-green-500"
                        />
                      ) : (
                        <XCircle
                          color="red"
                          className="inline h-4 w-4 text-red-500"
                        />
                      )}
                    </li>
                    <li>
                      {t("respectful")}:{" "}
                      {response.isRespectfulTone ? "Yes" : "No"}{" "}
                      {response.isRespectfulTone ? (
                        <CheckCircle
                          color="green"
                          className="inline h-4 w-4 text-green-500"
                        />
                      ) : (
                        <XCircle
                          color="red"
                          className="inline h-4 w-4 text-red-500"
                        />
                      )}
                    </li>
                  </ul>
                  {response.refinedMessage && (
                    <div className="mt-4">
                      <h3 className="font-semibold">{t("refined-message")}:</h3>
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
