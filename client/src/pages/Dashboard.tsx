import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import useApi from "../hooks/useApi";
import { useMemberstack } from "../context/MemberstackProvider";
import { preconnect } from "react-dom";
type FeatureKey = "letter" | "style" | "chat";

interface IUsageRecord {
  userId: string;
  featureKey: FeatureKey;
  usedAt: Date;
}

interface UsageCardProps {
  title: string;
  data: IUsageRecord[];
}

const UsageCard: React.FC<UsageCardProps> = ({ title, data }) => {
  return (
    <div className="flex flex-col items-center bg-secondary p-4 rounded-lg">
      <h2 className="text-xl font-semibold">{title} Usage</h2>
      <p className="text-2xl">
        {data.length} {data.length === 1 ? "time" : "times"}
      </p>
      <ul className="mt-2 text-sm text-gray-700">
        {data.length > 0 ? (
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
  );
};

const Dashboard = () => {
  const [categorizedUsage, setCategorizedUsage] = useState<
    Record<string, IUsageRecord[]>
  >({});
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const memberstack = useMemberstack();
  const { fetchData } = useApi();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    preconnect(import.meta.env.VITE_API_URL);
  }, []);

  useEffect(() => {
    if (!memberstack) return;

    const getUsage = async () => {
      try {
        const usageData = await fetchData<{ usageRecords: IUsageRecord[] }>(
          "/users/usage",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${await memberstack.getMemberCookie()}`,
            },
          }
        );

        const grouped = usageData.usageRecords.reduce((acc, rec) => {
          acc[rec.featureKey] = [...(acc[rec.featureKey] || []), rec];
          return acc;
        }, {} as Record<string, IUsageRecord[]>);

        setCategorizedUsage(grouped);
      } catch (err) {
        console.error("Failed to fetch usage data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getUsage();
  }, [memberstack]);

  if (!user || Object.keys(user).length === 0 || !memberstack) {
    return <div className="p-10 text-center">Redirecting...</div>;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 grid grid-cols-4 grid-rows-5 gap-5 p-24">
        <div className="col-span-4 row-span-1">
          <h1 className="text-4xl font-semibold text-primary">
            Hello, {user.firstName}!
          </h1>
        </div>

        <div className="col-span-2 row-span-4 row-start-2 col-start-1 bg-navbar rounded-2xl flex flex-col items-center">
          <h1 className="text-3xl p-4 font-semibold">Usage for last month</h1>
          <div className="grid grid-cols-3 gap-4 w-full px-4">
            {isLoading ? (
              <div className="col-span-3 text-center">Loading...</div>
            ) : (
              ["letter", "style", "chat"].map((key) => (
                <UsageCard
                  key={key}
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
                  data={categorizedUsage[key] || []}
                />
              ))
            )}
          </div>
        </div>

        <div className="col-span-2 row-span-4 row-start-2 col-start-3 bg-navbar rounded-2xl flex flex-col items-center">
          <h1 className="text-3xl p-4 font-semibold">Recent Actions</h1>
          <div className="p-4 italic text-gray-400">Coming soon...</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
