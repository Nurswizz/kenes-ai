import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import useApi from "../hooks/useApi";
import memberstack from "@memberstack/dom";
import { preconnect } from "react-dom";
type FeatureKey = "letter" | "style" | "chat";

interface IUsageRecord {
  userId: string;
  featureKey: FeatureKey;
  usedAt: Date;
}

const Dashboard = () => {
  preconnect(import.meta.env.VITE_API_URL);
  const user = JSON.parse(localStorage.getItem("user") || "");
  const { fetchData } = useApi();
  const [usage, setUsage] = useState<Array<IUsageRecord>>();
  const [letterUsage, setLetterUsage] = useState<Array<IUsageRecord>>();
  const [styleUsage, setStyleUsage] = useState<Array<IUsageRecord>>();
  const [chatUsage, setChatUsage] = useState<Array<IUsageRecord>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  if (user == "") {
    window.location.href = "/";
  }

  console.log(usage);

  useEffect(() => {
    setIsLoading(true);
    const getUsage = async () => {
      const memberstackInstance = await memberstack.init({
        publicKey: import.meta.env.VITE_MEMBERSTACK_PUBLIC_KEY,
        useCookies: true,
      });
      const usageData = await fetchData<{ usageRecords: IUsageRecord[] }>(
        "/users/usage",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${memberstackInstance.getMemberCookie()}`,
          },
        }
      );
      setUsage(usageData.usageRecords);
      setLetterUsage(
        usageData.usageRecords.filter(
          (record) => record.featureKey === "letter"
        )
      );
      setStyleUsage(
        usageData.usageRecords.filter((record) => record.featureKey === "style")
      );
      setChatUsage(
        usageData.usageRecords.filter((record) => record.featureKey === "chat")
      );
    };

    getUsage().catch((error) => {
      console.error("Error fetching usage data:", error);
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 grid grid-cols-4 grid-rows-5 gap-5 p-24">
        <div className="col-span-4 row-span-1 ">
          <h1 className="text-4xl font-semibold text-primary ">
            Hello, {user.firstName}!
          </h1>
        </div>
        <div className="col-span-2 row-span-4 row-start-2 col-start-1 bg-navbar rounded-2xl flex flex-col items-center">
          <h1 className="text-3xl p-4 font-semibold">Usage for last month</h1>
          <div className="flex flex-col justify-between">
            <div className="grid grid-cols-3 gap-4 w-full px-4">
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                [
                  { title: "Letter", data: letterUsage },
                  { title: "Style", data: styleUsage },
                  { title: "Chat", data: chatUsage },
                ].map(({ title, data }) => (
                  <div
                    key={title}
                    className="flex flex-col items-center bg-secondary p-4 rounded-lg"
                  >
                    <h2 className="text-xl font-semibold">{title} Usage</h2>
                    <p className="text-2xl">
                      {data ? data.length : 0}{" "}
                      {data && data.length === 1 ? "time" : "times"}
                    </p>
                    <ul className="mt-2 text-sm text-gray-700">
                      {data && data.length > 0 ? (
                        data.map((rec, idx) => (
                          <li key={idx}>
                            {new Date(rec.usedAt).toLocaleDateString()}{" "}
                            {new Date(rec.usedAt).toLocaleTimeString()}
                          </li>
                        ))
                      ) : (
                        <li className="italic">No records</li>
                      )}
                    </ul>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2 row-span-4 row-start-2 col-start-3 bg-navbar rounded-2xl flex flex-col items-center">
          <h1 className="text-3xl p-4 font-semibold">Recent Actions</h1>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
