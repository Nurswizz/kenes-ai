import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import useApi from "../hooks/useApi";
import { useMemberstackReady } from "../context/MemberstackProvider";
import { LoaderCircle } from "lucide-react";

type FeatureKey = "letter" | "style" | "chat";

interface IUsageRecord {
  userId: string;
  featureKey: FeatureKey;
  usedAt: Date;
}

interface IFeature {
  title: string;
  num?: number;
}

interface IActivity {
  title: string;
  date: Date;
  id: string;
}

const Feature = ({ title, num }: IFeature) => {
  const isLoading = typeof num !== "number";
  return (
    <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-2">
      <div className="w-full h-[120px] px-6 py-4 rounded-xl shadow-md bg-[#dfdfdf] flex flex-col justify-center">
        <h3 className="text-base md:text-lg text-gray-700">{title}</h3>
        <h1 className="text-2xl md:text-3xl font-semibold text-primary">
          {isLoading ? <LoaderCircle className="animate-spin w-6 h-6" /> : num}
        </h1>
      </div>
    </div>
  );
};

const Activity = ({ title, date }: IActivity) => {
  return (
    <div className="w-full flex flex-col hover:bg-[#cdcdcd] cursor-pointer p-3 rounded-lg transition-colors">
      <h1>{title}</h1>
      <h3>{date.toUTCString()}</h3>
    </div>
  );
};

const Dashboard = () => {
  const [categorizedUsage, setCategorizedUsage] = useState<
    Record<FeatureKey, IUsageRecord[]>
  >({
    letter: [],
    style: [],
    chat: [],
  });
  const [recentActivity, setRecentActivity] = useState<IActivity[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const isMemberstackReady = useMemberstackReady();
  const { fetchData } = useApi();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
    const fetchUsage = async () => {
      if (!isMemberstackReady) return;

      try {
        const usageData = await fetchData<{ usageRecords: IUsageRecord[] }>(
          "/users/usage"
        );

        const grouped = usageData.usageRecords.reduce(
          (acc, rec) => {
            acc[rec.featureKey] = [...(acc[rec.featureKey] || []), rec];
            return acc;
          },
          {
            letter: [],
            style: [],
            chat: [],
          } as Record<FeatureKey, IUsageRecord[]>
        );
        const recent = usageData.usageRecords.slice(0, 5).map((rec) => ({
          title: `Used ${rec.featureKey} feature`,
          date: new Date(rec.usedAt),
          id: `${rec.userId}-${rec.featureKey}-${rec.usedAt}`,
        }));
        setCategorizedUsage(grouped);
        setRecentActivity(recent.reverse().slice(0, 5));
      } catch (err) {
        console.error("Failed to fetch usage data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  }, [isMemberstackReady]);
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }
  const letterCount = categorizedUsage.letter.length;
  const styleCount = categorizedUsage.style.length;
  const chatCount = categorizedUsage.chat.length;

  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col p-6 sm:p-10 md:p-14 lg:p-16 gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold">Dashboard</h1>

        {/* Features */}
        <div className="flex flex-wrap -mx-2">
          <Feature title="Letters Drafted" num={letterCount} />
          <Feature title="Style Checks" num={styleCount} />
          <Feature title="Chat Uses" num={chatCount} />
        </div>

        {/* Recent Activity */}
        <div className="flex flex-col gap-3 mt-6">
          <h1 className="text-3xl sm:text-4xl font-bold">Recent Activity</h1>
          <div className="flex flex-col gap-5 mb-12">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <Activity
                  id={activity.id}
                  key={activity.id}
                  title={activity.title}
                  date={activity.date}
                />
              ))
            ) : (
              <div className="text-gray-500">No recent activity</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
