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

interface IFeature {
  title: string;
  num?: string;
}
interface IActivity {
  title: string;
  date: Date;
  id: string;
}
const Feature = ({ title, num = "Loading" }: IFeature) => {
  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2">
      <div className="w-full h-[120px] px-6 py-4 rounded-xl shadow-md bg-[#dfdfdf] flex flex-col justify-center">
        <h3 className="text-base md:text-lg text-gray-700">{title}</h3>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">
          {num}
        </h1>
      </div>
    </div>
  );
};
const Activity = ({ title, date, id }: IActivity) => {
  return (
    <div className="w-full flex flex-col hover:bg-[#cdcdcd] cursor-pointer p-3 rounded-lg transition-colors">
      <h1>{title}</h1>
      <h3>{date.toUTCString()}</h3>
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
    <div className="flex flex-col lg:flex-row h-full lg:h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 sm:p-10 md:p-14 lg:p-16 gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Dashboard</h1>

        {/* Features */}
        <div className="flex flex-wrap -mx-2">
          <Feature title="Letters Drafted" num="12" />
          <Feature title="Style Checks" num="12" />
          <Feature title="Chat Uses" num="12" />
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col gap-3 mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Recent Activity</h1>
          <div className="flex flex-col gap-5 mb-12">
            <Activity title="Letter Generation" date={new Date()} id="1" />
            <Activity title="Style Check" date={new Date()} id="2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
